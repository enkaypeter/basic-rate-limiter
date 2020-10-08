const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
import rateLimiter from "./rateLimiter";

require('dotenv').config()
const app = express();

const { users } = require("./models");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect(
    process.env.DB_CON_STRING,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Successfully Connected to the database');
        }
    }
);

app.get('/read', rateLimiter);
app.get('/status', (req, res, next) => {
    users.find({api_key:req.query.api_key}, async (err,response) => {
        if(err){
            console.error(err);
        ;}

        let [responseData] = response
        const {MAX_REQUEST_COUNT} = responseData
        return res.status(200).send({
            success: true,
            data: { MAX_REQUEST_COUNT }
        })
    })

})
   
app.listen(3000)
  

