import { z } from 'zod';

// Permissive email check: allows Unicode (e.g. Turkish ı) in the local part.
// We rely on real deliverability checks downstream, not on regex.
const emailField = z
  .string()
  .trim()
  .min(3)
  .max(200)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid email' });

const baseFields = {
  name: z.string().trim().min(1).max(120),
  email: emailField,
  phone: z.string().trim().min(3).max(40),
  language: z.enum(['en', 'tr']).optional(),
};

const customer = z.object({
  ...baseFields,
  form_type: z.literal('customer'),
  company: z.string().trim().min(1).max(160),
  entities: z.enum(['1', '2-5', '6-15', '16+']),
});

const partner = z.object({
  ...baseFields,
  form_type: z.literal('partner'),
  company: z.string().trim().min(1).max(160),
  partner_type: z.enum(['erp', 'bank', 'distribution', 'advisory', 'other']),
});

const investor = z.object({
  ...baseFields,
  form_type: z.literal('investor'),
  fund: z.string().trim().min(1).max(160),
  stage: z.enum(['angel', 'seed', 'series_a', 'exploring']),
});

export const leadSchema = z.discriminatedUnion('form_type', [
  customer,
  partner,
  investor,
]);
export type LeadInput = z.infer<typeof leadSchema>;

export const whitepaperSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: emailField,
  company: z.string().trim().max(160).optional(),
  language: z.enum(['en', 'tr']).optional(),
});
export type WhitepaperInput = z.infer<typeof whitepaperSchema>;
