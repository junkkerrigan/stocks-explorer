import fs from 'fs';
import path from 'path';

export const loadCompaniesNames = () => {
    const content = fs.readFileSync(path.join(__dirname, '/assets/stockSymbols.json'));
    return JSON.parse(content.toString()) as unknown as Record<string, string>;
};

