import { parseInquiryPayload, type InquiryFieldErrors } from "./schema.js";
import { checkForSpamSignals } from "./spamGuard.js";
import type { NotificationAdapter } from "./notificationAdapter.js";
import type { CrmAdapter } from "./crmAdapter.js";
import type { RateLimiter } from "./rateLimiter.js";

const GENERIC_VALIDATION_ERROR = "Please check the highlighted fields and try again.";

export interface InquiryHandlerDeps {
  notificationAdapter: NotificationAdapter;
  crmAdapter: CrmAdapter;
  rateLimiter: RateLimiter;
  now?: () => number;
}

export type InquiryHandlerResult =
  | { ok: true; status: 200 }
  | { ok: false; status: 400; error: string; fieldErrors?: InquiryFieldErrors }
  | { ok: false; status: 429; error: string; retryAfterSeconds: number }
  | { ok: false; status: 502; error: string };

export async function handleInquirySubmission(
  rawPayload: unknown,
  rateLimitKey: string,
  deps: InquiryHandlerDeps
): Promise<InquiryHandlerResult> {
  const rateLimit = deps.rateLimiter.check(rateLimitKey);

  if (!rateLimit.allowed) {
    return {
      ok: false,
      status: 429,
      error: "Too many requests. Please wait a moment and try again.",
      retryAfterSeconds: rateLimit.retryAfterSeconds ?? 60,
    };
  }

  const parsed = parseInquiryPayload(rawPayload);

  if (!parsed.success) {
    return { ok: false, status: 400, error: GENERIC_VALIDATION_ERROR, fieldErrors: parsed.fieldErrors };
  }

  const spamCheck = checkForSpamSignals(parsed.data, deps.now?.() ?? Date.now());

  if (spamCheck.isSpam) {
    console.warn("[inquiry:spam]", { reason: spamCheck.reason });
    return { ok: false, status: 400, error: GENERIC_VALIDATION_ERROR };
  }

  try {
    await deps.notificationAdapter.send(parsed.data);
  } catch (error) {
    console.error("[inquiry:notify] delivery failed", error instanceof Error ? error.message : error);
    return {
      ok: false,
      status: 502,
      error: "We could not deliver your inquiry right now. Please email or call ACC directly.",
    };
  }

  try {
    const crmResult = await deps.crmAdapter.createLead(parsed.data);

    if (!crmResult.ok) {
      console.error("[inquiry:crm] handoff failed", crmResult.reason);
    }
  } catch (error) {
    console.error("[inquiry:crm] handoff threw", error instanceof Error ? error.message : error);
  }

  return { ok: true, status: 200 };
}
