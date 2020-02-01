import { ValidResponse, StocksApiResponse, ResponseCacheItem } from './types';

export const isValidResponseCacheItem = (val: any): val is ResponseCacheItem => {
    return (
        val
        && 'status' in val
        && typeof val.status === 'number'
        && 'response' in val
    );
};

export const isValidStocksApiResponse = (value: any): value is StocksApiResponse => {
    return (
        value
        && 'Global Quote' in value
    );
};

export const isValidResponse = (val: any): val is ValidResponse => {
    return (
        val
        && 'companyName' in val
        && 'price' in val
    );
};