// src/app/api/would-you-rather/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getMongoClient from '@/app/lib/mongodb';

// Get vote counts for a specific question
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const questionId = searchParams.get('questionId');
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }
    
    const client = await getMongoClient();
    const db = client.db();
    
    // Get vote counts for this question
    const voteCounts = await db.collection('wouldYouRatherVotes').aggregate([
      { $match: { questionId } },
      { $group: { 
        _id: '$vote',
        count: { $sum: 1 }
      }}
    ]).toArray();
    
    // Transform the result into a more usable format
    const result = {
      questionId,
      optionA: 0,
      optionB: 0
    };
    
    voteCounts.forEach((item) => {
      if (item._id === 'A') {
        result.optionA = item.count;
      } else if (item._id === 'B') {
        result.optionB = item.count;
      }
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error fetching vote counts:', error);
    return NextResponse.json({ error: 'Failed to fetch vote counts' }, { status: 500 });
  }
}

// Submit a new vote
export async function POST(request: NextRequest) {
  try {
    const { questionId, vote } = await request.json();
    
    if (!questionId || !vote || (vote !== 'A' && vote !== 'B')) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    
    const client = await getMongoClient();
    const db = client.db();
    
    // Get the IP address of the user to prevent duplicate votes
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check if this IP has already voted on this question
    const existingVote = await db.collection('wouldYouRatherVotes').findOne({
      questionId,
      ip
    });
    
    if (existingVote) {
      // Update the existing vote if it changed
      if (existingVote.vote !== vote) {
        await db.collection('wouldYouRatherVotes').updateOne(
          { _id: existingVote._id },
          { 
            $set: { 
              vote,
              updatedAt: new Date()
            }
          }
        );
      }
    } else {
      // Store the new vote
      await db.collection('wouldYouRatherVotes').insertOne({
        questionId,
        vote,
        ip,
        createdAt: new Date()
      });
    }
    
    // Get updated vote counts
    const voteCounts = await db.collection('wouldYouRatherVotes').aggregate([
      { $match: { questionId } },
      { $group: { 
        _id: '$vote',
        count: { $sum: 1 }
      }}
    ]).toArray();
    
    // Transform the result
    const result = {
      questionId,
      optionA: 0,
      optionB: 0
    };
    
    voteCounts.forEach((item) => {
      if (item._id === 'A') {
        result.optionA = item.count;
      } else if (item._id === 'B') {
        result.optionB = item.count;
      }
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error saving vote:', error);
    return NextResponse.json({ error: 'Failed to save vote' }, { status: 500 });
  }
}
