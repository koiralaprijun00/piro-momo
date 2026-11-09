import { NextResponse } from 'next/server';
import getMongoClient from '@/lib/mongodb';
import { z } from 'zod';
import { DAY_MS, getClientIp, invalidInput, isUnderRateLimit, readJson, tooManyRequests } from '@/lib/api';

const FeedbackSchema = z.object({
  feedback: z.string().trim().min(1, 'Feedback is required').max(2000, 'Feedback cannot exceed 2000 characters'),
  email: z.union([z.email('Invalid email address').max(200), z.literal(''), z.null()]).optional(),
});

/** At most 10 feedback messages per visitor per day. */
const FEEDBACK_PER_DAY = 10;

export async function POST(request: Request) {
  try {
    const parsed = FeedbackSchema.safeParse(await readJson(request));
    if (!parsed.success) return invalidInput(parsed.error);
    const { feedback, email } = parsed.data;

    const client = await getMongoClient();
    // Feedback has always been stored in the 'geo-nepal' database; keep it there.
    const db = client.db('geo-nepal');
    const ip = getClientIp(request);

    if (!(await isUnderRateLimit(db, { collection: 'feedback', timeField: 'submittedAt', ip, max: FEEDBACK_PER_DAY, windowMs: DAY_MS }))) {
      return tooManyRequests();
    }

    await db.collection('feedback').insertOne({
      feedback,
      email: email || null,
      submittedAt: new Date(),
      source: 'homepage',
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
