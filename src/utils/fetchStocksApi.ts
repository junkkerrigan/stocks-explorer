import generateString from'crypto-random-string';
import axios from'axios';
import ipv6 from 'random-ipv6';

export const fetchStocksApi = {
    _host: 'https://www.alphavantage.co',
    _createConfig: () => ({
        headers: {
            'X-Forwarded-For': ipv6()
        }
    }),
    quote: function (symbol: string, includeHost: boolean = true) { // second param is for testing purposes
        const key = generateString({length: 5});
        const url = (
            includeHost
                ? this._host
                : ''
        ) + `/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`;
        return axios.get(url, this._createConfig());
    },
    search: function (query: string) {
        const key = generateString({length: 5});
        const url = `${this._host}/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${
            generateString(key)
        }`;
        return axios.get(url, this._createConfig());
    }
};

