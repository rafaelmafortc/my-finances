export const locales = ['pt-BR', 'en'] as const;
export type Locale = (typeof locales)[number];
