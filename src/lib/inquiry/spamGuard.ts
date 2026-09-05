import type { InquiryInput } from "./schema.js";

const MIN_FILL_TIME_MS = 1500;
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

export type SpamCheckResult = { isSpam: false } | { isSpam: true; reason: "honeypot" | "too-fast" | "clock-skew" };

export function checkForSpamSignals(input: InquiryInput, now: number = Date.now()): SpamCheckResult {
  if (input.website.length > 0) {
    return { isSpam: true, reason: "honeypot" };
  }

  const elapsed = now - input.startedAt;

  if (elapsed < 0 && Math.abs(elapsed) > MAX_CLOCK_SKEW_MS) {
    return { isSpam: true, reason: "clock-skew" };
  }

  if (elapsed >= 0 && elapsed < MIN_FILL_TIME_MS) {
    return { isSpam: true, reason: "too-fast" };
  }

  return { isSpam: false };
}
