import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

import { z } from 'zod';

const FeedbackSchema = z.object({
  feedback: z.string().min(1, 'Feedback is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input using Zod
    const validatedData = FeedbackSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { feedback, email } = validatedData.data;
    
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
