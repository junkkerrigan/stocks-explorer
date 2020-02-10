import {
    ResponseDataToCache, ResponseOnSuccess, ResponseOnFail, StocksApiResponse,
    SearchResponse
} from '../types';

// export const isResponseContentOnSuccess = (val: any): val is ResponseContentOnSuccess => {
//     return (
//         val
//         && typeof val.stockSymbol === 'string' // if no property - undefined
//         && typeof val.companyName === 'string'
//         && typeof val.price === 'string'
//     );
// };
//
// export const isResponseContentOnFail = (val: any): val is ResponseContentOnFail => {
//     return (
//         val
//         && typeof val.stockSymbol === 'string' // if no property - undefined
//         && typeof val.message === 'string'
//     );
// };

export const isSearchResponse = (val: any): val is SearchResponse => {
    return (
        val
        && Array.isArray(val.bestMatches)
    );
};

export const isStocksApiResponse = (value: any): value is StocksApiResponse => {
    return (
        value
        && (
            'Global Quote' in value
            || 'Note' in value
            || 'Error Message' in value
        )
    );
};