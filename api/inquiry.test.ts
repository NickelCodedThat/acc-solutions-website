import { describe, expect, it, vi } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import handler from "./inquiry.js";

function createMockReq(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: "POST",
    headers: {},
    body: {},
    ...overrides,
  } as unknown as VercelRequest;
}

function createMockRes() {
  const res: Partial<VercelResponse> & { statusCode?: number; jsonBody?: unknown; headers: Record<string, string> } =
    {
      headers: {},
    };

  res.setHeader = vi.fn((key: string, value: string) => {
    res.headers[key] = value;
    return res as VercelResponse;
  }) as VercelResponse["setHeader"];
  res.status = vi.fn((code: number) => {
    res.statusCode = code;
    return res as VercelResponse;
  }) as VercelResponse["status"];
  res.json = vi.fn((data: unknown) => {
    res.jsonBody = data;
    return res as VercelResponse;
  }) as VercelResponse["json"];
  res.end = vi.fn(() => res as VercelResponse) as VercelResponse["end"];

  return res as VercelResponse & { statusCode?: number; jsonBody?: unknown; headers: Record<string, string> };
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jordan Rivers",
    email: "jordan@example.com",
    business: "Rivers Landscaping",
    service: "Reduce manual work",
    message: "Scheduling is entirely on paper and it is falling apart.",
    website: "",
    startedAt: Date.now() - 5000,
    ...overrides,
  };
}

describe("api/inquiry handler", () => {
  it("rejects non-POST methods", async () => {
    const req = createMockReq({ method: "GET", headers: { "x-forwarded-for": "203.0.113.1" } });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(405);
  });

  it("responds to CORS preflight without invoking business logic", async () => {
    const req = createMockReq({ method: "OPTIONS", headers: { "x-forwarded-for": "203.0.113.2" } });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(204);
    expect(res.headers["Access-Control-Allow-Origin"]).toBeTruthy();
  });

  it("rejects a request whose declared content-length exceeds the payload cap", async () => {
    const req = createMockReq({
      headers: { "content-length": "999999", "x-forwarded-for": "203.0.113.3" },
      body: validBody(),
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(413);
  });

  it("rejects a malformed (non-object) body", async () => {
    const req = createMockReq({ headers: { "x-forwarded-for": "203.0.113.4" }, body: "not-json" as never });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("accepts a valid inquiry end-to-end through the dev notification adapter", async () => {
    const req = createMockReq({ headers: { "x-forwarded-for": "203.0.113.5" }, body: validBody() });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonBody).toEqual({ ok: true });
  });

  it("returns field-level validation errors for an invalid submission", async () => {
    const req = createMockReq({
      headers: { "x-forwarded-for": "203.0.113.6" },
      body: validBody({ email: "not-an-email" }),
    });
    const res = createMockRes();

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect((res.jsonBody as { fieldErrors?: Record<string, unknown> }).fieldErrors?.email).toBeDefined();
  });

  it("rate-limits repeated requests from the same client", async () => {
    const ip = "203.0.113.7";

    for (let i = 0; i < 5; i += 1) {
      const req = createMockReq({ headers: { "x-forwarded-for": ip }, body: validBody() });
      const res = createMockRes();
      await handler(req, res);
      expect(res.statusCode).toBe(200);
    }

    const req = createMockReq({ headers: { "x-forwarded-for": ip }, body: validBody() });
    const res = createMockRes();
    await handler(req, res);

    expect(res.statusCode).toBe(429);
    expect(res.headers["Retry-After"]).toBeTruthy();
  });
});
