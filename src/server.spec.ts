import request from 'supertest';
import app from './server';

import { isValidResponse } from './typing';

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
        let res = await  request(app)
            .get('/api/v1/stocks?stockSymbol=IOIOI')
            .send();

        expect(res.status).toEqual(400);
        expect(res.text).toEqual('unknown stock symbol');
    });
    it('should return valid response when correct symbol is passed', async () => {
        let res = await  request(app)
            .get('/api/v1/stocks?stockSymbol=MSFT')
            .send();

        expect(res.status).toEqual(200);
        expect(isValidResponse(res.body)).toEqual(true);
    });
});