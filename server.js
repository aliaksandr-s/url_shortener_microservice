'use strict'

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const Url = require('./model');

mongoose.connect(process.env.MLAB_URL_MICROSERVICE)

app.get('/', (req, res) => {
    res.send('Heello')
});

//test db
app.route('/url')
    
    .post((req, res) => {
        var url = new Url();
        url.fullUrl = "http://google.com";
        url.shortUrl = "http://g3";

        url.save((err) => {
            if (err) throw err;
        })

        res.json({message: "url saved"})
    })

    .get((req, res) => {
        Url.find((err, urls) => {
            if (err) throw err;

            res.json(urls)
        })
    })


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})