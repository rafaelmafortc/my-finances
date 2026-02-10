export function formatCurrencyBR(value: number): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) return '0,00';
  const fixed = Math.round(value * 100) / 100;
  const intPart = Math.floor(Math.abs(fixed));
  const decPart = Math.round((Math.abs(fixed) - intPart) * 100);
  const formatted = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${fixed < 0 ? '-' : ''}${formatted},${String(decPart).padStart(2, '0')}`;
}

export function formatDateBR(d: Date): string {
  const x = new Date(d);
  const day = String(x.getDate()).padStart(2, '0');
  const month = String(x.getMonth() + 1).padStart(2, '0');
  const year = x.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatCurrencyWithSign(
  value: number,
  isIncome: boolean
): string {
  const signal = isIncome ? '+' : '-';
  const formatted = Math.abs(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${signal} R$ ${formatted}`;
}
