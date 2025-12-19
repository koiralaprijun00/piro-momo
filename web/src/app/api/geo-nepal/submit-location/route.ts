import { NextRequest, NextResponse } from 'next/server';
import getMongoClient from '@/lib/mongodb';
import { z } from 'zod';

// Define the validation schema
const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  imageUrl: z.string().url('Invalid image URL'),
  funFact: z.string().min(1, 'Fun fact is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = locationSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { name, lat, lng, imageUrl, funFact } = validatedData.data;

    // Connect to MongoDB
    const client = await getMongoClient();
    const db = client.db();

    // Store the submission
    await db.collection('geoNepalSubmissions').insertOne({
      name,
      lat,
      lng,
      imageUrl,
      funFact,
      submittedAt: new Date(),
      status: 'pending',
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown',
    });

    return NextResponse.json({ success: true, message: 'Location submitted successfully' });
  } catch (error) {
    console.error('Submit location error:', error);
    return NextResponse.json(
      { error: 'Failed to submit location' },
      { status: 500 }
    );
  }
}
