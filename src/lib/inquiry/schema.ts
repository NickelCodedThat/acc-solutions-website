import { z } from "zod";

const SERVICE_OPTIONS = [
  "Reduce manual work",
  "Organize operations",
  "Improve management visibility",
  "Improve customer experience",
  "Strengthen digital presence",
  "Connect existing tools",
  "Not sure yet",
] as const;

const BUDGET_OPTIONS = [
  "Not selected",
  "Under $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000+",
  "Need guidance",
] as const;

const TIMELINE_OPTIONS = ["Not selected", "ASAP", "2-4 weeks", "1-2 months", "Flexible"] as const;

const normalizeWhitespace = (value: string) => value.trim().replace(/\s+/g, " ");

const trimmedString = (maxLength: number) =>
  z
    .string()
    .transform((value) => normalizeWhitespace(value))
    .pipe(z.string().min(1).max(maxLength));

export const inquirySchema = z.object({
  name: trimmedString(200),
  email: z.string().trim().max(254).email(),
  business: trimmedString(200),
  service: z.enum(SERVICE_OPTIONS),
  budget: z.enum(BUDGET_OPTIONS).optional().default("Not selected"),
  timeline: z.enum(TIMELINE_OPTIONS).optional().default("Not selected"),
  message: trimmedString(5000),
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().finite(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export type InquiryFieldErrors = Partial<Record<keyof InquiryInput, string[]>>;

export function parseInquiryPayload(payload: unknown):
  | { success: true; data: InquiryInput }
  | { success: false; fieldErrors: InquiryFieldErrors } {
  const result = inquirySchema.safeParse(payload);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: InquiryFieldErrors = {};

  for (const issue of result.error.issues) {
    const key = issue.path[0];

    if (typeof key !== "string") {
      continue;
    }

    const field = key as keyof InquiryInput;
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return { success: false, fieldErrors };
}
