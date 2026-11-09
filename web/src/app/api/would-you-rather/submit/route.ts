// src/app/api/would-you-rather/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getMongoClient from '@/lib/mongodb';
import { z } from 'zod';
import { DAY_MS, getClientIp, invalidInput, isUnderRateLimit, readJson, tooManyRequests } from '@/lib/api';

const WYRSchema = z.object({
  question: z.string().trim().min(5, 'Question must be at least 5 characters long').max(500, 'Question cannot exceed 500 characters'),
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters'),
});

/** At most 5 question suggestions per visitor per day (same as riddles). */
const SUBMISSIONS_PER_DAY = 5;

export async function POST(request: NextRequest) {
  try {
    const parsed = WYRSchema.safeParse(await readJson(request));
    if (!parsed.success) return invalidInput(parsed.error);
    const { question, fullName } = parsed.data;

    const client = await getMongoClient();
    const db = client.db();
    const ip = getClientIp(request);

    if (!(await isUnderRateLimit(db, { collection: 'wouldYouRatherSubmissions', timeField: 'submittedAt', ip, max: SUBMISSIONS_PER_DAY, windowMs: DAY_MS }))) {
      return tooManyRequests();
    }

    await db.collection('wouldYouRatherSubmissions').insertOne({
      question,
      fullName,
      submittedAt: new Date(),
      status: 'pending', // Use this to track if the question has been reviewed
      ip,
    });

    return NextResponse.json({ success: true, message: 'Question submitted successfully' });
  } catch (error) {
    console.error('Error submitting question:', error);
    return NextResponse.json({ error: 'Failed to submit question' }, { status: 500 });
  }
}
