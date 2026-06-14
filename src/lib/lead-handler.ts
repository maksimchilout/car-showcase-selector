import { createBitrixLead } from "./bitrix.server";
import { leadSchema } from "./lead-schema";

export async function handleLeadRequest(body: unknown) {
  const data = leadSchema.parse(body);
  await createBitrixLead(data);
  return { ok: true as const };
}
