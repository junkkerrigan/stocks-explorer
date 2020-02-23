export type SearchResponse = {
    'bestMatches': Array<{
        [key: string]: string
    }>
}
export type QuoteResponse = {
    'Global Quote': {
        [key: string]: string
    }
}
export type InvalidRequestResponse = {
    'Error Message': string
}
export type KeyExpirationResponse = {
    'Note': string
}

export type StocksApiResponse =
    | SearchResponse
    | QuoteResponse
    | InvalidRequestResponse
    | KeyExpirationResponse
