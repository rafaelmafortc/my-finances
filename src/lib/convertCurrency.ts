type Currency = 'USD' | 'BRL' | string;

export async function convertCurrency(
    value: number,
    from: Currency,
    to: Currency
): Promise<number> {
    if (from === to) return value;

    const url = `https://api.frankfurter.app/latest?amount=${value}&from=${from}&to=${to}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.rates || !data.rates[to]) {
        throw new Error(`Erro ao converter de ${from} para ${to}`);
    }

    return parseFloat(data.rates[to].toFixed(2));
}
