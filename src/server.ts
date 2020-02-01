import express from 'express'
import axios from 'axios';
import LruCache from 'lru-cache';
import { stocksApiUrl, nockApi, getCompanyName } from './utils';

import { isValidResponseCacheItem, isValidStocksApiResponse } from './typing';

const succeedRequestsCache = new LruCache({
    maxAge: 1000*60*10
});

const badRequestsCache = new LruCache({
    maxAge: 1000*60*60*24
});

nockApi();

const app = express();
app.use(express.json());

const apiRouter = express.Router();
app.use('/api/v1/stocks', apiRouter);

apiRouter.get('/', async (req, res) => {
    let cached = badRequestsCache.get(req.originalUrl);
    if (isValidResponseCacheItem(cached)) {
        res.status(cached.status).send(cached.response);
        return;
    }
    cached = succeedRequestsCache.get(req.originalUrl);
    if (isValidResponseCacheItem(cached)) {
        res.status(cached.status).send(cached.response);
        console.log('cached: succeed');
        return;
    }

    let { stockSymbol }  = req.query;
    if (!stockSymbol) {
        let response = 'invalid request: non-empty `stockSymbol` param required';
        res.status(400).send(response);
        badRequestsCache.set(req.originalUrl, {
            status: 400,
            response
        });
        return;
    }
    if (typeof getCompanyName(stockSymbol) === 'undefined') {
        let response = 'unknown stock symbol';
        res.status(400).send(response);
        badRequestsCache.set(req.originalUrl, {
            status: 400,
            response
        });
        return;
    }
    const { data } = await axios.get(stocksApiUrl(stockSymbol));
    if (!isValidStocksApiResponse(data)) {
        console.log(data);
        res.status(503).send('request to external API failed');
        return;
    }
    const quoteData = data['Global Quote'];
    const price = (Array.from(Object.values(quoteData)))[4];
    let response = {
        companyName: getCompanyName(stockSymbol),
        price
    };
    res.status(200).send(response);
    succeedRequestsCache.set(req.originalUrl, {
        status: 200,
        response
    });
});

app.get('/', (req, res) => {
    res.status(200).send('root`s in place');
});

export default app;
