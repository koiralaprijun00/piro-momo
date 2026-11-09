import { NextResponse } from 'next/server';
import type { Db } from 'mongodb';
import { z } from 'zod';

/**
 * Shared helpers for the public API routes (feedback, riddle and question submissions, votes).
 * These routes need no sign-in, so every one of them limits input size and how often
 * one visitor can write.
 */

/**
 * The visitor's IP address. On Vercel, `x-forwarded-for` is set by the platform and its
 * first entry is the real client; later entries are proxies. Using only the first entry
 * stops visitors from getting a fresh identity by adding their own fake entries.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || request.headers.get('x-real-ip')?.trim() || 'unknown';
}

interface RateLimitOptions {
  /** Collection that stores the submissions being counted. */
  collection: string;
  /** Field holding the submission time. */
  timeField: string;
  ip: string;
  max: number;
  windowMs: number;
}

/**
 * True when this IP may write again. Counts the IP's recent documents in MongoDB, so the
 * limit holds across all serverless instances (an in-memory counter would not).
 */
export async function isUnderRateLimit(db: Db, options: RateLimitOptions): Promise<boolean> {
  const since = new Date(Date.now() - options.windowMs);
  const recent = await db.collection(options.collection).countDocuments({
    ip: options.ip,
    [options.timeField]: { $gte: since },
  });
  return recent < options.max;
}

export const DAY_MS = 24 * 60 * 60 * 1000;

export function tooManyRequests() {
  return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
}

export function invalidInput(error: z.ZodError) {
  return NextResponse.json(
    { error: 'Invalid input', details: error.issues.map((issue) => issue.message) },
    { status: 400 }
  );
}

/** Parses the JSON body, returning null (instead of throwing) when it isn't valid JSON. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
