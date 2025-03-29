export function currencyFormatter(value: number, currency: string) {
    const intlNumberFormat = new Intl.NumberFormat(
        currency === 'BRL' ? 'pt-BR' : 'en',
        {
            style: 'currency',
            currency: currency,
        }
    );

    return intlNumberFormat.format(value);
}
