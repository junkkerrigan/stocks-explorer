const generateString = require('crypto-random-string');

export const stocksApiUrl = {
    host: 'https://www.alphavantage.co',
    price: (symbol: string, includeHost: boolean = true) => {
        const key = generateString({length: 5});
        return (
            includeHost
                ? 'https://www.alphavantage.co'
                : ''
        ) + `/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`;
    },
    search: (query: string) => {
        const key = generateString({length: 5});
        return `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${
            generateString(key)
        }`;
    }
};

