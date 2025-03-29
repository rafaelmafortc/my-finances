export function currencyFormatter(value: number, currency: 'BRL' | 'USD') {
    const intlNumberFormat = new Intl.NumberFormat(
        currency === 'BRL' ? 'pt-BR' : 'en',
        {
            style: 'currency',
            currency: currency,
        }
    );

    return intlNumberFormat.format(value);
}
