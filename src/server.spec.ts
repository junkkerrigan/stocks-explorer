import request from 'supertest';
import app, { cachingTestingData } from './server';
import { badRequestsCache, succeedRequestsCache } from './utils';

import { isResponseContentOnSuccess, isResponseContentOnFail } from './typing';

describe('Stock Explorer API', () => {
    it('should receive response from root route', async () => {
        let res = await request(app)
            .get('/')
            .send();

        expect(res.status).toEqual(200);
    });

    it('should fail when no stock symbol passed', async () => {
        let res = await request(app)
            .get('/api/v1/stocks')
            .send();

        expect(res.status).toEqual(400);
    });

    it('should fail when invalid stock symbol passed', async () => {
        let res = await request(app)
            .get('/api/v1/stocks?stockSymbol=IOIOI')
            .send();

        expect(res.status).toEqual(400);
        expect(isResponseContentOnFail(res.body)).toEqual(true);
    });

    it('should return valid response when correct symbol is passed', async () => {
        let res = await request(app)
            .get('/api/v1/stocks?stockSymbol=MSFT')
            .send();

        expect(res.status).toEqual(200);
        expect(isResponseContentOnSuccess(res.body)).toEqual(true);
    });

    describe('caching testing', () => {
        beforeEach(() => {
            cachingTestingData.isLastResponseFromCache = false;
            succeedRequestsCache.reset();
            badRequestsCache.reset();
        });

        it('should return cached data for correct request', async () => {
            await request(app)
                .get('/api/v1/stocks?stockSymbol=GOOGL')
                .send();

            const isCached = (
                typeof succeedRequestsCache.get('/api/v1/stocks?stockSymbol=GOOGL') !== 'undefined'
            );
            expect(isCached).toEqual(true);

            let res = await request(app)
                .get('/api/v1/stocks?stockSymbol=GOOGL')
                .send();

            expect(isResponseContentOnSuccess(res.body)).toEqual(true);
            expect(cachingTestingData.isLastResponseFromCache).toEqual(true);
        });

        it('should return cached data for request without `stockSymbol` param', async () => {
            await request(app)
                .get('/api/v1/stocks?someParam=someData')
                .send();

            const isCached = (
                typeof badRequestsCache.get('/api/v1/stocks?someParam=someData') !== 'undefined'
            );
            expect(isCached).toEqual(true);

            let res = await request(app)
                .get('/api/v1/stocks?someParam=someData')
                .send();

            expect(isResponseContentOnFail(res.body)).toEqual(true);
            expect(cachingTestingData.isLastResponseFromCache).toEqual(true);
        });

        it('should return cached data for request with incorrect `stockSymbol` param', async () => {
            await request(app)
                .get('/api/v1/stocks?stockSymbol=PUTIN')
                .send();

            const isCached = (
                typeof badRequestsCache.get('/api/v1/stocks?stockSymbol=PUTIN') !== 'undefined'
            );
            expect(isCached).toEqual(true);

            let res = await request(app)
                .get('/api/v1/stocks?stockSymbol=PUTIN')
                .send();

            expect(isResponseContentOnFail(res.body)).toEqual(true);
            expect(cachingTestingData.isLastResponseFromCache).toEqual(true);
        });
    })
});