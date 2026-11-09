'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The one state machine every async form uses:
 *
 *   idle ──submit──▶ submitting ──ok──▶ success ──(resetAfterMs)──▶ idle
 *                         │
 *                         └──fail──▶ error ──submit──▶ submitting
 *
 * A form can only be in one of these states, so it can never show "sending"
 * and "sent" at the same time, or report success after the server failed.
 */
export type RequestStatus =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export const IDLE: RequestStatus = { status: 'idle' };

interface UseRequestOptions {
  /** When set, a successful request returns to `idle` after this many milliseconds. */
  resetAfterMs?: number;
  /** Message shown when the task throws something that is not an Error. */
  fallbackError?: string;
}

/**
 * Runs an async task through the RequestStatus machine.
 * The task must throw (for example on `!response.ok`) for the form to show an error.
 */
export function useRequest(options: UseRequestOptions = {}) {
  const { resetAfterMs, fallbackError = 'Something went wrong. Please try again.' } = options;
  const [state, setState] = useState<RequestStatus>(IDLE);
  const mounted = useRef(true);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setState(IDLE);
  }, []);

  const run = useCallback(
    async (task: () => Promise<void>): Promise<boolean> => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      setState({ status: 'submitting' });
      try {
        await task();
        if (!mounted.current) return true;
        setState({ status: 'success' });
        if (resetAfterMs !== undefined) {
          resetTimer.current = setTimeout(() => {
            if (mounted.current) setState(IDLE);
          }, resetAfterMs);
        }
        return true;
      } catch (error) {
        if (mounted.current) {
          const message = error instanceof Error && error.message ? error.message : fallbackError;
          setState({ status: 'error', message });
        }
        return false;
      }
    },
    [resetAfterMs, fallbackError]
  );

  return {
    state,
    run,
    reset,
    isSubmitting: state.status === 'submitting',
    isSuccess: state.status === 'success',
    errorMessage: state.status === 'error' ? state.message : null,
  };
}

/** Throws when a fetch response is not ok, so `useRequest` moves to `error`. */
export async function ensureOk(response: Response, message: string): Promise<Response> {
  if (!response.ok) throw new Error(message);
  return response;
}
