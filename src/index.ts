import app from './server';

const port = process.env.API_PORT || 3000;

const apiServer = app.listen(port, () => {
    console.log(`API is available on http://localhost:${port}/`);
});

export default apiServer;

`*************************************

1) we have a list of companies and their stock symbols respectively

2) we have API that provides data depending on symbol (also apikey, we have one and function, that is 
known, json format is by default)

3) TDD

4) we have one endpoint, customizing by query parameters



**************************************`;