import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleInquirySubmission } from "../src/lib/inquiry/handleInquiry";
import { InMemoryRateLimiter } from "../src/lib/inquiry/rateLimiter";
import {
  ConsoleNotificationAdapter,
  NotConfiguredNotificationAdapter,
  ResendNotificationAdapter,
} from "../src/lib/inquiry/notificationAdapter";
import { NoopCrmAdapter } from "../src/lib/inquiry/crmAdapter";

const MAX_CONTENT_LENGTH_BYTES = 20_000;

const rateLimiter = new InMemoryRateLimiter(5, 10 * 60 * 1000);
const crmAdapter = new NoopCrmAdapter();

function resolveAllowedOrigin(): string {
  return process.env.ALLOWED_ORIGIN ?? "https://accsolutions.dev";
}

function resolveNotificationAdapter() {
  const { RESEND_API_KEY, INQUIRY_FROM_EMAIL, INQUIRY_TO_EMAIL } = process.env;

  if (RESEND_API_KEY && INQUIRY_FROM_EMAIL && INQUIRY_TO_EMAIL) {
    return new ResendNotificationAdapter(RESEND_API_KEY, INQUIRY_FROM_EMAIL, INQUIRY_TO_EMAIL);
  }

  if (process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production") {
    return new ConsoleNotificationAdapter();
  }

  return new NotConfiguredNotificationAdapter();
}

function getClientKey(req: VercelRequest): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0]?.trim();
  return ip ?? "unknown";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigin = resolveAllowedOrigin();

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }

  const contentLength = Number(req.headers["content-length"] ?? 0);

  if (Number.isFinite(contentLength) && contentLength > MAX_CONTENT_LENGTH_BYTES) {
    res.status(413).json({ ok: false, error: "Request too large." });
    return;
  }

  if (typeof req.body !== "object" || req.body === null) {
    res.status(400).json({ ok: false, error: "Invalid request." });
    return;
  }

  const result = await handleInquirySubmission(req.body, getClientKey(req), {
    notificationAdapter: resolveNotificationAdapter(),
    crmAdapter,
    rateLimiter,
  });

  if (!result.ok && result.status === 429) {
    res.setHeader("Retry-After", String(result.retryAfterSeconds));
  }

  res.status(result.status).json(
    result.ok
      ? { ok: true }
      : { ok: false, error: result.error, fieldErrors: "fieldErrors" in result ? result.fieldErrors : undefined }
  );
}
