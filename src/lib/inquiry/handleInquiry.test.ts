import { describe, expect, it, vi } from "vitest";
import { handleInquirySubmission, type InquiryHandlerDeps } from "./handleInquiry.js";
import type { NotificationAdapter } from "./notificationAdapter.js";
import type { CrmAdapter } from "./crmAdapter.js";
import type { RateLimiter } from "./rateLimiter.js";

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jordan Rivers",
    email: "jordan@example.com",
    business: "Rivers Landscaping",
    service: "Reduce manual work",
    budget: "Not selected",
    timeline: "Not selected",
    message: "Scheduling is entirely on paper and it is falling apart.",
    website: "",
    startedAt: Date.now() - 5000,
    ...overrides,
  };
}

function makeDeps(overrides: Partial<InquiryHandlerDeps> = {}): InquiryHandlerDeps {
  const notificationAdapter: NotificationAdapter = {
    send: vi.fn().mockResolvedValue({ delivered: true, providerId: "test" }),
  };
  const crmAdapter: CrmAdapter = {
    createLead: vi.fn().mockResolvedValue({ ok: true }),
  };
  const rateLimiter: RateLimiter = {
    check: vi.fn().mockReturnValue({ allowed: true }),
  };

  return { notificationAdapter, crmAdapter, rateLimiter, ...overrides };
}

describe("handleInquirySubmission", () => {
  it("succeeds and hands off to notification + CRM adapters", async () => {
    const deps = makeDeps();
    const result = await handleInquirySubmission(validPayload(), "ip-1", deps);

    expect(result).toEqual({ ok: true, status: 200 });
    expect(deps.notificationAdapter.send).toHaveBeenCalledTimes(1);
    expect(deps.crmAdapter.createLead).toHaveBeenCalledTimes(1);
  });

  it("rejects when the rate limiter denies the request, without touching adapters", async () => {
    const deps = makeDeps({
      rateLimiter: { check: vi.fn().mockReturnValue({ allowed: false, retryAfterSeconds: 42 }) },
    });

    const result = await handleInquirySubmission(validPayload(), "ip-1", deps);

    expect(result).toEqual({
      ok: false,
      status: 429,
      error: expect.any(String),
      retryAfterSeconds: 42,
    });
    expect(deps.notificationAdapter.send).not.toHaveBeenCalled();
  });

  it("returns a safe, generic error for invalid payloads without leaking internals", async () => {
    const deps = makeDeps();
    const result = await handleInquirySubmission({ name: "" }, "ip-1", deps);

    expect(result.ok).toBe(false);
    if (!result.ok && result.status === 400) {
      expect(result.error).not.toMatch(/zod|stack|at Object/i);
    }
    expect(deps.notificationAdapter.send).not.toHaveBeenCalled();
  });

  it("rejects a honeypot-filled submission without delivering it", async () => {
    const deps = makeDeps();
    const result = await handleInquirySubmission(validPayload({ website: "http://spam.example" }), "ip-1", deps);

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(deps.notificationAdapter.send).not.toHaveBeenCalled();
  });

  it("returns a 502 and does not report success when the notification provider fails", async () => {
    const deps = makeDeps({
      notificationAdapter: { send: vi.fn().mockRejectedValue(new Error("provider exploded: secret=abc123")) },
    });

    const result = await handleInquirySubmission(validPayload(), "ip-1", deps);

    expect(result.ok).toBe(false);
    expect(result.status).toBe(502);
    if (!result.ok && result.status === 502) {
      expect(result.error).not.toContain("secret=abc123");
    }
  });

  it("still reports success when the CRM handoff fails, since the durable notification already succeeded", async () => {
    const deps = makeDeps({
      crmAdapter: { createLead: vi.fn().mockResolvedValue({ ok: false, reason: "17hats adapter not implemented" }) },
    });

    const result = await handleInquirySubmission(validPayload(), "ip-1", deps);

    expect(result).toEqual({ ok: true, status: 200 });
  });

  it("still reports success when the CRM handoff throws", async () => {
    const deps = makeDeps({
      crmAdapter: { createLead: vi.fn().mockRejectedValue(new Error("network error")) },
    });

    const result = await handleInquirySubmission(validPayload(), "ip-1", deps);

    expect(result).toEqual({ ok: true, status: 200 });
  });

  it("rejects a malformed (non-object) request body safely", async () => {
    const deps = makeDeps();
    const result = await handleInquirySubmission("garbage", "ip-1", deps);

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
  });
});
