import nock from 'nock';
import { fetchStocksApi } from '../utils';

import { StocksApiResponse } from '../typing'

const nockData: {
    [key: string]: StocksApiResponse
} = {
    'WIX': {
        'Global Quote': {
            '01. symbol': 'WIX',
            '02. open': '142.8100',
            '03. high': '145.3700',
            '04. low': '142.5100',
            '05. price': '144.9100',
            '06. volume': '395666',
            '07. latest trading day': '2020-01-30',
            '08. previous close': '143.4000',
            '09. change': '1.5100',
            '10. change percent': '1.0530%'
        }
    }
};

const nockApi = () => {
    const scope = nock('https://www.alphavantage.co', { allowUnmocked: true });
    for (let symbol in nockData) {
        scope
            .persist()
            .get(fetchStocksApi.quote(symbol, false))
            .reply(200, nockData[symbol]);
    }
};

export { nockApi };