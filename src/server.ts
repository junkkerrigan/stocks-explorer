import express from 'express'
import axios from 'axios';
import { stocksApiUrl, nockApi, pricesCache, unknownSymbolsCache } from './utils';

import {
    isSearchResponse,
    ExplorerFailResponse,
    SymbolData,
    isKeyExpirationResponse,
    isInvalidRequestResponse,
    KeyExpirationResponse, isPriceResponse, ExplorerSuccessResponse,
} from './typing';

// nockApi();

const app = express();
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
    push: function (item: boolean) { this._isResponseFromCache.push(item); },
    clear: function () { this._isResponseFromCache = Array<boolean>(); }
};

let stocksData: Array<SymbolData> = [];

const processInvalidResponse = (searchResult: any, symbol: string) => {
    if (isKeyExpirationResponse(searchResult)) {
        stocksData.push({
            symbol,
            message: 'Access to external API denied.'
        });
    } else if (isInvalidRequestResponse((searchResult))) {
        stocksData.push({
            symbol,
            message: 'Invalid request to external API.'
        })
    } else {
        stocksData.push({
            symbol,
            message: 'Request to external API failed.'
        })
    }
};

const processSymbol = async (symbol: string) => {
    const { data: searchResult } = await axios.get(stocksApiUrl.search(symbol));
    if (!isSearchResponse(searchResult)) {
        processInvalidResponse(searchResult, symbol);
        return;
    }

    let dataToCache: SymbolData;

    if (searchResult.bestMatches.length === 0) {
        dataToCache = {
            symbol,
            isMatch: false
        };
        stocksData.push(dataToCache);
        console.log(stocksData);
        unknownSymbolsCache.set(symbol, dataToCache);
        return;
    }

    const companyData = Array.from(Object.values(searchResult.bestMatches[0]));
    const companyName = companyData[1];
    const { data: quoteResponse } = await axios.get(stocksApiUrl.price(symbol));
    console.log(quoteResponse);

    if (!isPriceResponse(quoteResponse)) {
        processInvalidResponse(quoteResponse, symbol);
        return;
    }

    const priceData = Array.from(Object.values(quoteResponse["Global Quote"]));
    const price = priceData[4];

    dataToCache = {
        symbol,
        isMatch: true,
        data: {
            companyName,
            price
        }
    };
    stocksData.push(dataToCache);
    pricesCache.set(symbol, dataToCache);
};

apiRouter.get('/', async (req, res) => {
    stocksData = [];

    let { stockSymbols } = req.query;
    if (typeof stockSymbols === 'undefined') {
        const explorerResponse: ExplorerFailResponse = {
            message: '`stockSymbols` param required.'
        };
        res.status(400).send(explorerResponse);
        return;
    }

    if (stockSymbols === '') {
        stockSymbols = 'WIX'; // ;)
    }
    const stockSymbolsList = stockSymbols.split(',');
    for (let symbol of stockSymbolsList) {
        let cache = pricesCache.get(symbol);
        if (typeof cache !== 'undefined') {
            stocksData.push(cache);
            isResponseFromCache.push(true);
            continue;
        } else {
            cache = unknownSymbolsCache.get(symbol);
            if (typeof cache !== 'undefined') {
                isResponseFromCache.push(true);
                stocksData.push(cache);
                continue;
            }
        }
        isResponseFromCache.push(false);
        await processSymbol(symbol);
    }

    const explorerResponse: ExplorerSuccessResponse = {
        stockSymbols,
        stocksData
    };
    res.status(200).send(explorerResponse);
});

app.get('/', (req, res) => {
    res.status(200).send('root`s in place');
});

export default app;
