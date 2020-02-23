import { FailStockData, StockData, ExplorerSuccessResponse, SuccessStockData } from '../types';

export const isFailStockData = (val: any): val is FailStockData => {
    return (
        val
        && typeof val.message === 'string'
    );
};

export const isSuccessStockData = (val: any): val is SuccessStockData => {
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
        );
    }
    return true;
};

export const isStockData = (val: any): val is StockData => {
    return (
        isFailStockData(val)
        || isSuccessStockData(val)
    );
};

export const isExplorerSuccessResponse = (val: any): val is ExplorerSuccessResponse => {
    if (
        !(
            val
            && Array.isArray(val.stockSymbolsList)
            && Array.isArray(val.stocksData)
        )
    ) {
        return false;
    }
    val.stocksData.forEach((stockData: any) => {
        if (!isStockData(stockData)) return false;
    });
    val.stockSymbolsList.forEach((symbol: any) => {
        return (typeof symbol === 'string');
    });
    return true;
};