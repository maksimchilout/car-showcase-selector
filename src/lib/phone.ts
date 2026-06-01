/** Допустимые символы в поле телефона: цифры, +, ( ) */
export const PHONE_INPUT_REGEX = /^[0-9+()]*$/;

const PHONE_STRIP_REGEX = /[^0-9+()]/g;

export function sanitizePhoneInput(value: string): string {
  return value.replace(PHONE_STRIP_REGEX, "");
}

export function isPhoneValid(value: string): boolean {
  const trimmed = value.trim();
  if (!PHONE_INPUT_REGEX.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 9;
}
