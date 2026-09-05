import type { InquiryInput } from "./schema.js";

export interface CrmAdapter {
  /** Best-effort CRM handoff. Must never throw — return ok:false on failure. */
  createLead(inquiry: InquiryInput): Promise<{ ok: true } | { ok: false; reason: string }>;
}

/**
 * ACC currently runs 17hats as its client-office/CRM, but 17hats has no
 * public API (confirmed: no developer API, only a hosted Lead Capture Form
 * embed and a Zapier contact-sync integration — neither accepts a
 * server-to-server "create lead" call with a secret key). There is no clean,
 * credential-safe way to push a lead into 17hats directly from this
 * endpoint today.
 *
 * This adapter is the boundary Phase 6+ can fill in — e.g. a webhook-based
 * adapter posting to a Zapier "Catch Hook" URL that creates the 17hats
 * contact — without touching the form or the rest of the backend. Until
 * then it is a no-op so the pipeline has somewhere to plug into.
 */
export class NoopCrmAdapter implements CrmAdapter {
  async createLead(): Promise<{ ok: true } | { ok: false; reason: string }> {
    return { ok: true };
  }
}
