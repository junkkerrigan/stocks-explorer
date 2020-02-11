import {FailSymbolData, SymbolData, ExplorerSuccessResponse, SuccessSymbolData } from '../types';

export const isFailSymbolData = (val: any): val is FailSymbolData => {
    return (
        val
        && typeof val.message === 'string'
    );
};

export const isSuccessSymbolData = (val: any): val is SuccessSymbolData => {
    if (!val) return false;
    if (!('symbol' in val)) return false;
    if (!('isMatch' in val)) return false;
    if (val.isMatch) {
        return (
            'data' in val
            && typeof val.data.companyName === 'string'
            && typeof val.data.price === 'string'
            && 'change' in val.data
            && typeof val.data.change.value === 'string'
            && typeof val.data.change.percent === 'string'
        )
    }
    return true;
};

export const isSymbolData = (val: any): val is SymbolData => {
    return (
        isFailSymbolData(val)
        || isSuccessSymbolData(val)
    );
};

export const isExplorerSuccessResponse = (val: any): val is ExplorerSuccessResponse => {
    if (!(
        val
        && typeof val.stockSymbols === 'string'
        && Array.isArray(val.stocksData)

    )) {
        return false;
    }
    val.stocksData.forEach((stockData: any) => {
        if (!isSymbolData(stockData)) return false;
    });
    return true;
};