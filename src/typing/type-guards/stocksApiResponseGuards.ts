import {
    StocksApiSearchResponse, StocksApiKeyExpirationResponse, StocksApiInvalidRequestResponse, StocksApiQuoteResponse
} from '../types';

export const isSearchResponse = (val: any): val is StocksApiSearchResponse => {
    return (
        val
        && Array.isArray(val.bestMatches)
    );
};

export const isKeyExpirationResponse = (val: any): val is StocksApiKeyExpirationResponse => {
    return (
        val
        && typeof val['Note'] === 'string'
    );
};

export const isInvalidRequestResponse = (val: any): val is StocksApiInvalidRequestResponse => {
    return (
        val
        && typeof val['Error Message'] === 'string'
    );
};

export const isQuoteResponse = (val: any): val is StocksApiQuoteResponse => {
    return (
        val
        && 'Global Quote' in val
    );
};
