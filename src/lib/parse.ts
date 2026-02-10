export function parseCurrencyBR(masked: string): number {
  const cleaned = masked.replace(/\D/g, '');
  if (cleaned.length === 0) return 0;
  const value = parseInt(cleaned, 10) / 100;
  return Number.isNaN(value) ? 0 : value;
}

export function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
}

export function parseDDMMYYYY(str: string): Date | null {
  const cleaned = str.replace(/\D/g, '');
  if (cleaned.length !== 8) return null;
  const day = parseInt(cleaned.slice(0, 2), 10);
  const month = parseInt(cleaned.slice(2, 4), 10) - 1;
  const year = parseInt(cleaned.slice(4, 8), 10);
  const d = new Date(year, month, day);
  if (isNaN(d.getTime())) return null;
  if (d.getDate() !== day || d.getMonth() !== month || d.getFullYear() !== year) return null;
  return d;
}
