interface BaseResponse {
    stockSymbols: string,
}

interface SymbolDataOnMatch {
    isMatch: true,
    data: {
        companyName: string,
        price: string
    }
}

interface SymbolDataOnNoMatch {
    isMatch: false
}

export interface ResponseOnSuccess extends BaseResponse {
    stocksData: Array<SymbolDataOnMatch | SymbolDataOnNoMatch>
}

export interface ResponseOnFail extends BaseResponse {
    message: string,
}

export type ResponseDataToCache = {
    status: number,
    data: ResponseOnFail | ResponseOnSuccess
};

