export function maskCurrencyBR(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (digits.length === 0) return '';
  if (digits.length <= 2) {
    return `0,${digits.padStart(2, '0')}`;
  }
  const rawInt = digits.slice(0, -2).replace(/^0+/, '') || '0';
  const intPart = rawInt.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decPart = digits.slice(-2);
  return `${intPart},${decPart}`;
}

export function maskDDMMYYYY(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
