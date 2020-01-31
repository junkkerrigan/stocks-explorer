import request from 'supertest';
import apiServer from './index';

describe('Stock Explorer API', () => {
    beforeEach(() => {
        apiServer.close();
    });

    it('should receive response from root route', async () => {
        let res = null;
        res = await request(apiServer)
            .get('/')
            .send();

        expect(res.status).toEqual(200);
    });
});