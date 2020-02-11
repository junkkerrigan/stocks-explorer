interface BaseSymbolData {
    symbol: string,
}
export interface BaseSuccessSymbolData extends BaseSymbolData {
    isMatch: boolean
}
export interface MatchSymbolData extends BaseSuccessSymbolData {
    isMatch: true,
    data: {
        companyName: string,
        price: string,
        change: {
            value: string,
            percent: string
        }
    }
}
export interface NoMatchSymbolData extends BaseSuccessSymbolData {
    isMatch: false
}
export interface FailSymbolData extends BaseSymbolData {
    message: string
}

export type SuccessSymbolData = MatchSymbolData | NoMatchSymbolData
export type SymbolData = SuccessSymbolData | FailSymbolData
export type ExplorerSuccessResponse = {
    stockSymbolsList: Array<string>,
    stocksData: Array<SymbolData>
}
export type ExplorerFailResponse = {
    message: string
}


