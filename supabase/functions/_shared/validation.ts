export const sanitizeText = (value: string, maxLength = 200) =>
  value.replace(/[<>]/g, "").trim().slice(0, maxLength);

export const sanitizeQuery = (value: string | null, maxLength = 80) => {
  if (!value) return null;
  return sanitizeText(value, maxLength);
};

export const parseNumber = (value: string | null) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const ensureString = (value: unknown, field: string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing field: ${field}`);
  }
  return sanitizeText(value, 200);
};

export const ensureOptionalString = (value: unknown, maxLength = 200) => {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return null;
  return sanitizeText(value, maxLength);
};
