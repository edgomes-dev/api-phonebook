import express from 'express'
import mongoose from 'mongoose'
const cors = require('cors')
require('dotenv').config()

import router from './routes/contactRoutes'

const app = express()
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use((req, res, next) => {    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors({
        "origin": '*',
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
    }));
    next();
});

app.use(express.json());

app.use('/api', router);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const port = 3333;
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@apicluster.qdshx.mongodb.net/bancodaapi?retryWrites=true&w=majority`)
.then(() => 
{
    console.log("Conectou ao mongoDB")
    app.listen(port, () => console.log(`servidor rodando na porta ${port}`));  
})