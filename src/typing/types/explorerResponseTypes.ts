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
        price: string
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
    stockSymbols: string,
    stocksData: Array<SymbolData>
}
export type ExplorerFailResponse = {
    message: string
}


