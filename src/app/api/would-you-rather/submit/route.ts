// src/app/api/would-you-rather/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getMongoClient from '@/app/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { question, fullName } = await request.json();
    
    if (!question || !question.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }
    
    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
    
    // Connect to MongoDB
    const client = await getMongoClient();
    const db = client.db();
    
    // Store the question submission
    await db.collection('wouldYouRatherSubmissions').insertOne({
      question: question.trim(),
      fullName: fullName.trim(),
      submittedAt: new Date(),
      status: 'pending', // Use this to track if the question has been reviewed
      // Get IP to prevent spam (optional)
      ip: request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown',
    });
    
    return NextResponse.json({ success: true, message: 'Question submitted successfully' });
    
  } catch (error) {
    console.error('Error submitting question:', error);
    return NextResponse.json(
      { error: 'Failed to submit question' },
      { status: 500 }
    );
  }
}
