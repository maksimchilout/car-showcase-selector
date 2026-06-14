import { z } from "zod";

import { isPhoneValid, PHONE_INPUT_REGEX } from "./phone";

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Укажите имя"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_INPUT_REGEX, "Допустимы только цифры, + и скобки")
    .refine(isPhoneValid, "Укажите корректный номер телефона"),
  carName: z.string().trim().min(1),
  kind: z.enum(["test-drive", "booking"]),
});

export type LeadInput = z.infer<typeof leadSchema>;
