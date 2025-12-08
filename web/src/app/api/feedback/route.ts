import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { feedback, email } = await request.json();
    
    // Connect to MongoDB using your existing client
    const client = await clientPromise();
    const db = client.db('geo-nepal'); // Using your existing database
    
    // Create a new collection for feedback if it doesn't exist
    const feedbackCollection = db.collection('feedback');
    
    // Store the feedback
    await feedbackCollection.insertOne({
      feedback,
      email: email || null,
      submittedAt: new Date(),
      source: 'homepage'
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
