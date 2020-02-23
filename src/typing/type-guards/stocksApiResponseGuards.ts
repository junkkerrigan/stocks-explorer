import {
    SearchResponse, KeyExpirationResponse, InvalidRequestResponse, QuoteResponse
} from '../types';

export const isSearchResponse = (val: any): val is SearchResponse => {
    return (
        val
        && Array.isArray(val.bestMatches)
    );
};

export const isKeyExpirationResponse = (val: any): val is KeyExpirationResponse => {
    return (
        val
        && typeof val['Note'] === 'string'
    );
};

export const isInvalidRequestResponse = (val: any): val is InvalidRequestResponse => {
    return (
        val
        && typeof val['Error Message'] === 'string'
    );
};

export const isQuoteResponse = (val: any): val is QuoteResponse => {
    return (
        val
        && 'Global Quote' in val
    );
};
