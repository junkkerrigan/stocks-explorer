import { ResponseContentOnSuccess, ResponseContentOnFail, CachedResponse,
    StocksApiResponseOnSuccess } from './types';

export const isResponseContentOnSuccess = (val: any): val is ResponseContentOnSuccess => {
    return (
        val
        && typeof val.stockSymbol === 'string' // if no property - undefined
        && typeof val.companyName === 'string'
        && typeof val.price === 'string'
    );
};

export const isResponseContentOnFail = (val: any): val is ResponseContentOnFail => {
    return (
        val
        && typeof val.stockSymbol === 'string' // if no property - undefined
        && typeof val.message === 'string'
    );
};

export const isStocksApiResponseOnSuccess = (value: any): value is StocksApiResponseOnSuccess => {
    return (
        value
        && 'Global Quote' in value
    );
};