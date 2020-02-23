import { QuoteRequestBody, SearchRequestBody } from '../types';

export const isQuoteRequestBody = (val: any): val is QuoteRequestBody => {
    if (
        !(
            val
            && Array.isArray(val.stockSymbols)
        )
    ) {
        return false;
    }

    val.stockSymbols.forEach((item: any) => {
        if (typeof item !== 'string') {
            return false;
        }
    });

    return true;
};

export const isSearchRequestBody = (val: any): val is SearchRequestBody => {
    return (
        val
        && typeof val.query === 'string'
    );
};