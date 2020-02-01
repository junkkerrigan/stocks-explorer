import app from './server';

const port = process.env.API_PORT || 3000;

app.listen(port, () => {
    console.log(`API is available on http://localhost:${port}/`);
});

`*************************************

1) we have a list of companies and their stock symbols respectively

2) we have API that provides data depending on symbol (also apikey, we have one and function, that is 
known, json format is by default)

3) TDD

4) we have one endpoint, customizing by query parameters

5) request: stock symbol, response: stock price

6) my request query params: ?stockSymbol=str, this transforms into server to many other query params 


-- invalid symbol -> 400
-- external fail -> 503
-- correct request and external response -> 200 + { companyName: ..., price: ... }

it'll cache only succeed requests for 10 mins and invalid symbols for a day
**************************************`;