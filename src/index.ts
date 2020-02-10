import app from './server';

const port = process.env.API_PORT || 3000;

app.listen(port, () => {
    console.log(`API is available on http://localhost:${port}/`);
});

`*************************************

-- we expect query param, named stockSymbols
-- it must be list of symbols, joined by comma
-- if there isn't such query param, -> cache
{
    status: 400,
    message: 'Non-empty "stockSymbols" param required.',
}
-- if it's empty, -> WIX stocks :)
-- create a function to process each stock
-- split param into array
-- process every symbol in array with implemented function
-- first of all, request endpoint to get company name // TODO: add possibility to pass flag to get 
                                                      // all the matches into query
-- foreach symbol, -> cache 
{
    status: 200,
    data: [
        {
            isMatch: boolean,
            data?: {
                companyName,
                stockSymbol, 
                price
            } 
        },
        {
            ...
        },
        ...
    ]
}

**************************************`;