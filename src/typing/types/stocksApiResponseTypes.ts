type ResponseContent = Record<string, string>

export type SearchResponse = {
    'bestMatches': Array<ResponseContent>
}

export type PriceResponse = {
    'Global Quote': ResponseContent
}

export type InvalidRequestResponse = {
    'Error Message': string
}

export type KeyExpirationResponse = {
    'Note': string
}

export type StocksApiResponse =
    | SearchResponse
    | PriceResponse
    | InvalidRequestResponse
    | KeyExpirationResponse
