const stocksApiKey = 'UB9LFWR2W89OEG7S';

export const stocksApiUrl = (symbol: string, includeHost: boolean = true) =>
    (includeHost ? 'https://www.alphavantage.co' : '')
        + `/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stocksApiKey}`;

