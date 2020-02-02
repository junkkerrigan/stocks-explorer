import express from 'express'
import axios from 'axios';
import { stocksApiUrl, nockApi, getCompanyName, succeedRequestsCache, badRequestsCache } from './utils';

import {
    isStocksApiResponseOnSuccess, CachedResponse, ResponseContentOnSuccess, ResponseContentOnFail
} from './typing';

// nockApi();

const app = express();
app.use(express.json());

const apiRouter = express.Router();
app.use('/api/v1/stocks', apiRouter);

let isResponseFromCache: boolean;

export const cachingTestingData = {
    _isLastResponseFromCache: false,
    get isLastResponseFromCache() {
        return this._isLastResponseFromCache;
    },
    set isLastResponseFromCache(value) {
        this._isLastResponseFromCache = value
    }
};

apiRouter.get('/', async (req, res) => {
    let cachedResponse = badRequestsCache.get(req.originalUrl);
    if (typeof cachedResponse !== 'undefined') {
        const { data, status } = cachedResponse;
        cachingTestingData.isLastResponseFromCache = true;
        res.status(status).send(data);
        return;
    }

    cachedResponse = succeedRequestsCache.get(req.originalUrl);
    if (typeof cachedResponse !== 'undefined') {
        const { data, status } = cachedResponse;
        cachingTestingData.isLastResponseFromCache = true;
        res.status(status).send(data);
        return;
    }

    let { stockSymbol }  = req.query;
    let dataToCache: CachedResponse;
    let data: ResponseContentOnFail | ResponseContentOnSuccess;

    if (!stockSymbol) {
        data = {
            message: 'Invalid request: non-empty `stockSymbol` param required.',
            stockSymbol: 'Was not provided.'
        };
        res.status(400).send(data);

        dataToCache = {
            status: 400,
            data
        };
        badRequestsCache.set(req.originalUrl, dataToCache);

        return;
    }

    if (typeof getCompanyName(stockSymbol) === 'undefined') {
        data = {
            message: 'Unknown stock symbol.',
            stockSymbol
        };
        res.status(400).send(data);

        dataToCache = {
            status: 400,
            data
        };
        badRequestsCache.set(req.originalUrl, dataToCache);

        return;
    }

    const { data: stocksResponse } = await axios.get(stocksApiUrl(stockSymbol));
    if (!isStocksApiResponseOnSuccess(stocksResponse)) {
        console.log(stocksResponse);
        res.status(503).send('Request to external API failed.');
        return;
    }

    const stocksDataObject = stocksResponse['Global Quote'];
    const stocksDataList = Array.from(
        Object.values(stocksDataObject)
    );
    const price = stocksDataList[4];

    data = {
        stockSymbol,
        companyName: getCompanyName(stockSymbol),
        price
    };
    res.status(200).send(data);

    dataToCache = {
        status: 200,
        data
    };
    succeedRequestsCache.set(req.originalUrl, dataToCache);
});

app.get('/', (req, res) => {
    res.status(200).send('root`s in place');
});

export default app;
