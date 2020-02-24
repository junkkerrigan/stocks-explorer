import generateString from'crypto-random-string';
import axios from'axios';
import ipv6 from 'random-ipv6';

export const stocksApiUrl = {
    host: 'https://www.alphavantage.co',
    config: {
        headers: {
            'X-Forwarded-For': ipv6()
        }
    },
    quote: function (symbol: string, includeHost: boolean = true) {
        const key = generateString({length: 5});
        const url = (
            includeHost
                ? this.host
                : ''
        ) + `/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`;
        return axios.get(url, this.config);
    },
    search: function (query: string) {
        const key = generateString({length: 5});
        const url = `${this.host}/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${
            generateString(key)
        }`;
        return axios.get(url, this.config);
    }
};

