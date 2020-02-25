interface BaseStockData {
    symbol: string,
}
export interface BaseSuccessStockData extends BaseStockData {
    isMatch: boolean,
}
export interface MatchStockData extends BaseSuccessStockData {
    isMatch: true,
    data: {
        companyName: string,
        price: string,
        change: {
            value: string,
            percent: string,
        },
    },
}
export interface NoMatchStockData extends BaseSuccessStockData {
    isMatch: false,
}
export interface FailStockData extends BaseStockData {
    message: string,
}

export type SuccessStockData = MatchStockData | NoMatchStockData;
export type StockData = SuccessStockData | FailStockData;
export type ExplorerSuccessResponse = {
    stockSymbolsList: Array<string>,
    stocksData: Array<StockData>,
};

// Actual

export type QuoteFailResponse = {
    message: string
};

export type QuoteSuccessResponse = Array<StocksResponse>;

export type StocksResponse = StocksSuccessResponse | StocksFailResponse;

export type StocksSuccessResponse = {
    success: true,
    stocksData: {
        company: {
            name: string,
            symbol: string
        },
        price: number,
        change: {
            value: number,
            percent: number
        }
    }
};

export type StocksFailResponse = {
    success: false,
    message: string
};

export type SearchFailResponse = {
    message: string
}

export type SearchSuccessResponse = {
    matches: Array<SearchResult>
};

export type SearchResult = {
    symbol: string,
    name: string
}
