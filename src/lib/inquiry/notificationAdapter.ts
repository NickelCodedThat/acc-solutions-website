import type { InquiryInput } from "./schema.js";

export interface NotificationAdapter {
  send(inquiry: InquiryInput): Promise<{ delivered: true; providerId: string }>;
}

export class NotificationDeliveryError extends Error {}

/**
 * Sends the inquiry to ACC via Resend (https://resend.com). Resend was chosen
 * because it is a lightweight transactional-email API with no infrastructure
 * to run, fits a serverless function cleanly, and its accepted-for-delivery
 * response is treated as the durable handoff boundary for this endpoint.
 *
 * Requires RESEND_API_KEY, INQUIRY_FROM_EMAIL (a verified sending address on
 * the Resend domain), and INQUIRY_TO_EMAIL. None of these are configured yet
 * — see PHASE_5.md for the exact account/domain setup Nicholas needs to do.
 */
export class ResendNotificationAdapter implements NotificationAdapter {
  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
    private readonly toEmail: string
  ) {}

  async send(inquiry: InquiryInput): Promise<{ delivered: true; providerId: string }> {
    const subject = `ACC Solutions Inquiry — ${inquiry.business}`;
    const text = [
      `New business improvement inquiry from accsolutions.dev`,
      "",
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Business: ${inquiry.business}`,
      `Primary Need: ${inquiry.service}`,
      `Estimated Budget: ${inquiry.budget}`,
      `Ideal Timeline: ${inquiry.timeline}`,
      "",
      "Business Context:",
      inquiry.message,
    ].join("\n");

    let response: Response;

    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: this.toEmail,
          reply_to: inquiry.email,
          subject,
          text,
        }),
      });
    } catch {
      throw new NotificationDeliveryError("Notification provider request failed");
    }

    if (!response.ok) {
      throw new NotificationDeliveryError(`Notification provider returned status ${response.status}`);
    }

    const body = (await response.json()) as { id?: string };

    if (!body.id) {
      throw new NotificationDeliveryError("Notification provider did not confirm delivery");
    }

    return { delivered: true, providerId: body.id };
  }
}

/** Local/dev/test double — logs instead of calling a real provider. */
export class ConsoleNotificationAdapter implements NotificationAdapter {
  async send(inquiry: InquiryInput): Promise<{ delivered: true; providerId: string }> {
    console.log("[inquiry:notify:dev]", { business: inquiry.business, email: inquiry.email });
    return { delivered: true, providerId: "console-dev" };
  }
}

/**
 * Used whenever the real provider isn't configured. It always fails loudly
 * rather than faking a delivered result, so a 200 response can never be
 * returned to a visitor unless an inquiry has actually reached ACC.
 */
export class NotConfiguredNotificationAdapter implements NotificationAdapter {
  async send(): Promise<{ delivered: true; providerId: string }> {
    throw new NotificationDeliveryError("Notification provider is not configured");
  }
}
