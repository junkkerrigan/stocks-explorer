interface ResponseContent {
    stockSymbol: string,
}

export interface ResponseContentOnSuccess extends ResponseContent {
    companyName: string,
    price: string
}

export interface ResponseContentOnFail extends ResponseContent {
    message: string,
}

export type StocksApiResponseOnSuccess = {
    'Global Quote': {
        [key: string]: string
    }
}

export type CachedResponse = {
    status: number,
    data: ResponseContentOnSuccess | ResponseContentOnFail
};
