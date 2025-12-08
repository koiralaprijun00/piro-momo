import { NextRequest, NextResponse } from 'next/server';
import getMongoClient from '@/lib/mongodb';
import { z } from 'zod';
import { Db } from 'mongodb';

// Input validation schema
const RiddleSubmissionSchema = z.object({
  riddle: z.string()
    .trim()
    .min(10, { message: 'Riddle must be at least 10 characters long' })
    .max(500, { message: 'Riddle cannot exceed 500 characters' }),
  fullName: z.string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  locale: z.enum(['en', 'np'], { 
    errorMap: () => ({ message: 'Invalid locale' }) 
  })
});

// Rate limiting helper (basic implementation)
async function checkRateLimit(ip: string, db: Db): Promise<boolean> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const submissionsFromIP = await db.collection('riddleSubmissions').countDocuments({
    ip,
    submittedAt: { $gte: twentyFourHoursAgo }
  });

  return submissionsFromIP < 5; // Max 5 submissions per 24 hours
}

export async function POST(request: NextRequest) {
  // Get client IP address
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';

  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate input using Zod
    const validatedData = RiddleSubmissionSchema.parse(body);

    // Connect to MongoDB
    const client = await getMongoClient();
    const db = client.db();

    // Check rate limiting
    const isAllowedToSubmit = await checkRateLimit(ip, db);
    if (!isAllowedToSubmit) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' }, 
        { status: 429 }
      );
    }

    // Sanitize and prepare data
    const sanitizedRiddle = {
      riddle: validatedData.riddle,
      fullName: validatedData.fullName,
      locale: validatedData.locale,
      submittedAt: new Date(),
      status: 'pending',
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    // Insert riddle submission
    const result = await db.collection('riddleSubmissions').insertOne(sanitizedRiddle);

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Riddle submitted successfully',
      submissionId: result.insertedId
    }, { status: 201 });

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: error.errors.map(e => e.message) 
        }, 
        { status: 400 }
      );
    }

    // Log unexpected errors
    console.error('Riddle submission error:', error);

    // Return generic error for unexpected issues
    return NextResponse.json(
      { error: 'Failed to submit riddle. Please try again.' }, 
      { status: 500 }
    );
  }
}

// Optional: Add CORS handling if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
