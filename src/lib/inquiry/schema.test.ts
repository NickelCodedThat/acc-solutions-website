import { describe, expect, it } from "vitest";
import { parseInquiryPayload } from "./schema";

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jordan Rivers",
    email: "jordan@example.com",
    business: "Rivers Landscaping",
    service: "Reduce manual work",
    budget: "$1,000 - $2,500",
    timeline: "2-4 weeks",
    message: "Scheduling is entirely on paper and it is falling apart.",
    website: "",
    startedAt: Date.now() - 5000,
    ...overrides,
  };
}

describe("parseInquiryPayload", () => {
  it("accepts a valid inquiry", () => {
    const result = parseInquiryPayload(validPayload());
    expect(result.success).toBe(true);
  });

  it("normalizes whitespace in text fields", () => {
    const result = parseInquiryPayload(validPayload({ name: "  Jordan   Rivers  " }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Jordan Rivers");
    }
  });

  it("defaults optional budget/timeline when omitted", () => {
    const { budget, timeline, ...rest } = validPayload();
    const result = parseInquiryPayload(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.budget).toBe("Not selected");
      expect(result.data.timeline).toBe("Not selected");
    }
  });

  it("rejects missing required fields", () => {
    const { name, ...rest } = validPayload();
    const result = parseInquiryPayload(rest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.name).toBeDefined();
    }
  });

  it("rejects an invalid email format", () => {
    const result = parseInquiryPayload(validPayload({ email: "not-an-email" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBeDefined();
    }
  });

  it("rejects an unrecognized service value", () => {
    const result = parseInquiryPayload(validPayload({ service: "Something else entirely" }));
    expect(result.success).toBe(false);
  });

  it("rejects an oversized message", () => {
    const result = parseInquiryPayload(validPayload({ message: "x".repeat(5001) }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.message).toBeDefined();
    }
  });

  it("rejects an oversized name", () => {
    const result = parseInquiryPayload(validPayload({ name: "x".repeat(201) }));
    expect(result.success).toBe(false);
  });

  it("rejects a malformed payload shape", () => {
    const result = parseInquiryPayload("this is not an object");
    expect(result.success).toBe(false);
  });

  it("rejects a completely empty payload", () => {
    const result = parseInquiryPayload({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.fieldErrors).length).toBeGreaterThan(0);
    }
  });
});
