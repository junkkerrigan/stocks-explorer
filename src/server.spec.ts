import request from 'supertest';
import app, { isResponseFromCache } from './server';
import { unknownSymbolsCache, pricesCache } from './utils';

import {
    isExplorerSuccessResponse,
    ExplorerSuccessResponse,
    SymbolData,
    isSuccessSymbolData,
    isSymbolData
} from './typing';

describe('Stock Explorer API', () => {
    it('should receive response from root route', async () => {
        let res = await request(app)
            .get('/')
            .send();

        expect(res.status).toEqual(200);
    });

    it('should fail when no stockSymbols passed', async () => {
        let res = await request(app)
            .get('/api/v1/stocks')
            .send();

        expect(res.status).toEqual(400);
    });

    it('should return false isMatch when invalid stock symbol passed', async () => {
        let res = await request(app)
            .get('/api/v1/stocks?stockSymbols=IOIOI')
            .send();

        expect(res.status).toEqual(200);
        expect(isExplorerSuccessResponse(res.body)).toEqual(true);
        expect(res.body.stocksData[0].isMatch).toEqual(false);
    });

    it('should return valid response when correct symbol is passed', async () => {
        let res = await request(app)
            .get('/api/v1/stocks?stockSymbols=MSFT')
            .send();

        expect(res.status).toEqual(200);
        expect(isExplorerSuccessResponse(res.body)).toEqual(true);
        expect(res.body.stocksData[0].isMatch).toEqual(true);
        expect(typeof res.body.stocksData[0].data.price !== 'undefined').toEqual(true);
    });

    it('should return valid response when multiple valid symbols passed', async () => {
        let res = await request(app)
            .get('/api/v1/stocks?stockSymbols=MSFT,WIX,ALTR')
            .send();

        expect(res.status).toEqual(200);
        expect(isExplorerSuccessResponse(res.body)).toEqual(true);
        res.body.stocksData.map((item: SymbolData) => {
            console.log(item);
            expect(isSymbolData(item)).toEqual(true);
            if (isSuccessSymbolData(item)) {
                console.log('success');
                expect(item.isMatch).toEqual(true);
            }
        })
    });

    describe('caching testing', () => {
        beforeEach(() => {
            isResponseFromCache.clear();
            pricesCache.reset(); unknownSymbolsCache.reset();
        });

        it('should return cached data for correct request', async () => {
            await request(app)
                .get('/api/v1/stocks?stockSymbols=GOOGL')
                .send();

            console.log(pricesCache.values());
            const isCached = (
                typeof pricesCache.get('GOOGL') !== 'undefined'
            );
            expect(isCached).toEqual(true);

            let res = await request(app)
                .get('/api/v1/stocks?stockSymbols=GOOGL')
                .send();

            expect(isExplorerSuccessResponse(res.body)).toEqual(true);
            expect(isResponseFromCache.getLast()[0]).toEqual(true);
        });

        it.skip('should return cached data for request without `stockSymbol` param', async () => {
            await request(app)
                .get('/api/v1/stocks?someParam=someData')
                .send();

            let res = await request(app)
                .get('/api/v1/stocks?someParam=someData')
                .send();

            expect(isExplorerSuccessResponse(res.body)).toEqual(true);
            expect(isResponseFromCache.getLast()[0]).toEqual(true);
        });

        it('should return cached data for request with incorrect `stockSymbol` param', async () => {
            await request(app)
                .get('/api/v1/stocks?stockSymbols=PUTIN')
                .send();

            console.log(unknownSymbolsCache.values());
            const isCached = (
                typeof unknownSymbolsCache.get('PUTIN') !== 'undefined'
            );
            expect(isCached).toEqual(true);

            let res = await request(app)
                .get('/api/v1/stocks?stockSymbols=PUTIN')
                .send();

            expect(isExplorerSuccessResponse(res.body)).toEqual(true);
            expect(isResponseFromCache.getLast()[0]).toEqual(true);
        });
    })
});