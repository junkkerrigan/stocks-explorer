export type ValidResponse = {
    companyName: string,
    price: string
}

export type StocksApiResponse = {
    'Global Quote': {
        [key: string]: string
    }
}

export type ResponseCacheItem = {
    status: number,
    response: any
};