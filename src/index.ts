import app from './server';

const port = process.env.API_PORT || 3000;

app.listen(port, () => {
    console.log(`API is available on http://localhost:${port}/`);
});

`*************************************

-- invalid symbol -> 400
-- external fail -> 503
-- correct request and external response -> 200 + { companyName: ..., price: ... }

**************************************`;