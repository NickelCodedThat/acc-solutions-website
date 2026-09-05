import { describe, expect, it } from "vitest";
import { checkForSpamSignals } from "./spamGuard";
import type { InquiryInput } from "./schema";

function baseInput(overrides: Partial<InquiryInput> = {}): InquiryInput {
  return {
    name: "Jordan Rivers",
    email: "jordan@example.com",
    business: "Rivers Landscaping",
    service: "Reduce manual work",
    budget: "Not selected",
    timeline: "Not selected",
    message: "Scheduling is a mess.",
    website: "",
    startedAt: Date.now() - 5000,
    ...overrides,
  };
}

describe("checkForSpamSignals", () => {
  it("passes a normal human submission", () => {
    const result = checkForSpamSignals(baseInput());
    expect(result.isSpam).toBe(false);
  });

  it("flags a filled honeypot field", () => {
    const result = checkForSpamSignals(baseInput({ website: "http://spam.example" }));
    expect(result).toEqual({ isSpam: true, reason: "honeypot" });
  });

  it("flags a submission completed faster than humanly plausible", () => {
    const now = Date.now();
    const result = checkForSpamSignals(baseInput({ startedAt: now - 200 }), now);
    expect(result).toEqual({ isSpam: true, reason: "too-fast" });
  });

  it("allows a submission right at the minimum fill time", () => {
    const now = Date.now();
    const result = checkForSpamSignals(baseInput({ startedAt: now - 1500 }), now);
    expect(result.isSpam).toBe(false);
  });

  it("flags a startedAt timestamp implausibly far in the future", () => {
    const now = Date.now();
    const result = checkForSpamSignals(baseInput({ startedAt: now + 10 * 60 * 1000 }), now);
    expect(result).toEqual({ isSpam: true, reason: "clock-skew" });
  });
});
