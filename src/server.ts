import express from 'express'
import axios from 'axios';
import cors from 'cors';
import { fetchStocksApi, nockApi, pricesCache, unknownSymbolsCache } from './utils';

import {
    isSearchResponse,
    isInvalidRequestResponse,
    isQuoteResponse,
    isQuoteRequestBody,
    StocksResponse,
    QuoteFailResponse,
    isSearchRequestBody,
    SearchSuccessResponse,
    SearchResult,
    SearchFailResponse,
    QuoteSuccessResponse,
} from './typing';

// nockApi();

const app = express();
app.use(cors());
// app.use(express.static('./dist'));
app.use(express.json());

const apiRouter = express.Router();
app.use('/api/v1/stocks', apiRouter);

// for testing purposes
export const isResponseFromCache = {
    _isResponseFromCache: Array<boolean>(),
    getLast: function(cnt: number = 1) {
        const { length } = this._isResponseFromCache;
        return this._isResponseFromCache.slice(length - cnt);
    },
    push: function(item: boolean) { this._isResponseFromCache.push(item); },
    clear: function() { this._isResponseFromCache = Array<boolean>(); }
};

const companyNames: Record<string, string> = { };

apiRouter.post('/search', async (req, res) => {
   if (!isSearchRequestBody(req.body) || req.body.query === '') {
       const explorerResponse: QuoteFailResponse = {
           message: 'Invalid payload: `query` field that is non-empty string required.'
       };
       res.status(400).send(explorerResponse);
       return;
   }

   const { query } = req.body;

   const { data } = await fetchStocksApi.search(query);

   if (isSearchResponse(data)) {
       const { bestMatches } = data;
       const matches: Array<SearchResult> = bestMatches.map(matchItem => {
           const values = Array.from(Object.values(matchItem));
           const symbol = values[0];
           const name = values[1];
           companyNames[symbol] = name;

           return {
               symbol,
               name
           };
       });
       const explorerResponse: SearchSuccessResponse = {
           matches
       };
       res.status(200).send(explorerResponse);
       return;
   } else {
       const explorerResponse: SearchFailResponse = {
           message: 'Request to external API failed'
       };
       res.status(503).send(explorerResponse);
   }
});

apiRouter.post('/quotes', async (req, res) => {
    if (!isQuoteRequestBody(req.body)) {
        const explorerResponse: QuoteFailResponse = {
            message: 'Invalid payload: `stockSymbols` field that is array of strings required.'
        };
        res.status(400).send(explorerResponse);
        return;
    }

    const { stockSymbols } = req.body;
    let stocksData: Array<StocksResponse> = new Array<StocksResponse>(stockSymbols.length);
    const stockSymbolsToRequestIndexMap: Array<number> = [];
    const requests: Array<ReturnType<typeof axios.get>> = [];

    stockSymbols.forEach((stockSymbol, idx) => {
       let cached = pricesCache.get(stockSymbol);
       if (typeof cached !== 'undefined')  {
           stocksData[idx] = cached;
           console.log('cache\n\n');
           return;
       }

       cached = unknownSymbolsCache.get(stockSymbol);
       if (typeof cached !== 'undefined') {
           console.log('cache\n\n');
           stocksData[idx] = cached;
           return;
       }

       stockSymbolsToRequestIndexMap.push(idx);
       requests.push(fetchStocksApi.quote(stockSymbol));
    });


    let apiResponseArr: Array<any> = [];
    try {
        apiResponseArr = await Promise.all(requests);
    } catch {
        const explorerResponse: QuoteFailResponse = {
            message: 'Requests to external API failed'
        };

        res.status(503).send(explorerResponse);
        return;
    }

    apiResponseArr.forEach((apiResponse, idx) => {
        const { data } = apiResponse;
        if (isQuoteResponse(data)) {
            const responseValues = Array.from(Object.values(data['Global Quote']));

            let isValidResponse: boolean = true;
            const symbol = responseValues[0];

            if (!(symbol in companyNames)) {
                const originalIdx = stockSymbolsToRequestIndexMap[idx];
                stocksData[originalIdx] = {
                    success: false,
                    message: 'Unknown stock symbol.'
                };
                return;
            }

            const name = companyNames[symbol];
            const price = Number(responseValues[4]);
            if (Number.isNaN(price)) {
                isValidResponse = false;
            }
            const value = Number(responseValues[8]);
            if (Number.isNaN(value)) {
                isValidResponse = false;
            }
            const percent = Number(responseValues[9].substr(0, responseValues[9].length - 1));
            if (Number.isNaN(percent)) {
                isValidResponse = false;
            }

            let stocksDataItem: StocksResponse;

            if (isValidResponse) {
                stocksDataItem  = {
                    success: true,
                    stocksData: {
                        company: {
                            symbol,
                            name
                        },
                        price,
                        change: {
                            percent,
                            value
                        }
                    }
                };
            } else {
                stocksDataItem = {
                    success: false,
                    message: 'Request to external API failed.'
                };
            }

            const originalIdx = stockSymbolsToRequestIndexMap[idx];
            stocksData[originalIdx] = stocksDataItem;
        } else if (isInvalidRequestResponse(data)) {
            const originalIdx = stockSymbolsToRequestIndexMap[idx];
            stocksData[originalIdx] = {
                success: false,
                message: 'Unknown stock symbol.'
            };
        } else {
            const originalIdx = stockSymbolsToRequestIndexMap[idx];
            stocksData[originalIdx] = {
                success: false,
                message: 'Request to external API failed.'
            };
        }
    });

    stockSymbolsToRequestIndexMap.forEach(originalIdx => {
        if (stocksData[originalIdx].success) {
            pricesCache.set(stockSymbols[originalIdx], stocksData[originalIdx]);
        } else {
            unknownSymbolsCache.set(stockSymbols[originalIdx], stocksData[originalIdx]);
        }
    });

    const explorerResponse: QuoteSuccessResponse = stocksData;
    res.status(200).send(explorerResponse);
});

app.get('/', (req, res) => {
    res.status(200).send('root is available');
});

export default app;
