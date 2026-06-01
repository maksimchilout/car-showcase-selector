export type LeadKind = "test-drive" | "booking";

const FORM_TITLES: Record<LeadKind, string> = {
  "test-drive": "Лизинг/кредит",
  booking: "Бронирование",
};

export type BitrixLeadInput = {
  name: string;
  phone: string;
  carName: string;
  kind: LeadKind;
};

function getBitrixWebhookBase(): string {
  const url = process.env.BITRIX_WEBHOOK_URL?.trim();
  if (!url) {
    throw new Error("BITRIX_WEBHOOK_URL is not configured");
  }
  return url.replace(/\/$/, "");
}

function getSiteLabel(): string {
  return process.env.LEAD_SITE_NAME?.trim() || "Citroën Belarus (сайт)";
}

export async function createBitrixLead(input: BitrixLeadInput) {
  const formTitle = FORM_TITLES[input.kind];
  const siteLabel = getSiteLabel();
  const webhook = getBitrixWebhookBase();

  const response = await fetch(`${webhook}/crm.lead.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        TITLE: `${formTitle} — ${input.name}`,
        NAME: input.name,
        PHONE: [{ VALUE: input.phone, VALUE_TYPE: "MOBILE" }],
        SOURCE_DESCRIPTION: siteLabel,
        COMMENTS: [
          `Сайт: ${siteLabel}`,
          `Тип заявки: ${formTitle}`,
          `Модель: ${input.carName}`,
        ].join("\n"),
      },
    }),
  });

  const payload = (await response.json()) as {
    result?: number;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || payload.error) {
    const detail = payload.error_description ?? payload.error ?? response.statusText;
    throw new Error(`Bitrix24: ${detail}`);
  }

  return payload;
}
