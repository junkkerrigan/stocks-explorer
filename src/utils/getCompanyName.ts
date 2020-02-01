import fs from 'fs';

const text = fs.readFileSync(__dirname + '/assets/stockSymbols.json').toString();
const supportedSymbolsDict: {
    [key: string]: string
} = JSON.parse(text);
const getCompanyName = (symbol: string) => supportedSymbolsDict[symbol];

export { getCompanyName };