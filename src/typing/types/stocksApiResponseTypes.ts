export type StocksApiSearchResponse = {
    'bestMatches': Array<{
        [key: string]: string
    }>
}
export type StocksApiQuoteResponse = {
    'Global Quote': {
        [key: string]: string
    }
}
export type StocksApiInvalidRequestResponse = {
    'Error Message': string
}
export type StocksApiKeyExpirationResponse = {
    'Note': string
}

export type StocksApiResponse =
    | StocksApiSearchResponse
    | StocksApiQuoteResponse
    | StocksApiInvalidRequestResponse
    | StocksApiKeyExpirationResponse
