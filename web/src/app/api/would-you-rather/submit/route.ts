// src/app/api/would-you-rather/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getMongoClient from '@/lib/mongodb';

import { z } from 'zod';

const WYRSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters long'),
  fullName: z.string().min(2, 'Name must be at least 2 characters long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using Zod
    const validatedData = WYRSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { question, fullName } = validatedData.data;
    
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
