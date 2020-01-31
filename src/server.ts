import express from 'express'

const app = express();
app.use(express.json());

const apiRouter = express.Router();
app.use('api/v1/stocks', apiRouter);

app.get('/', (req, res) => {
    res.status(200).send('root`s in place');
});

export default app;