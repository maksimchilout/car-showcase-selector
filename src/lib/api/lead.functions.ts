import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createBitrixLead } from "../bitrix.server";
import { isPhoneValid, PHONE_INPUT_REGEX } from "../phone";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Укажите имя"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_INPUT_REGEX, "Допустимы только цифры, + и скобки")
    .refine(isPhoneValid, "Укажите корректный номер телефона"),
  carName: z.string().trim().min(1),
  kind: z.enum(["test-drive", "booking"]),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator(leadSchema)
  .handler(async ({ data }) => {
    await createBitrixLead(data);
    return { ok: true as const };
  });
