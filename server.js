'use strict'

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const Url = require('./model'); // our model
const isUrl = require('nice-is-url'); // to check if url is a valid url 
const perma = require('perma'); // to short url

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MLAB_URL_MICROSERVICE);

app.get('/', (req, res) => {
    res.send('Usage info goes here') ///////////// add instrucions about api
});

// get a new url and save it in db
app.get('/new/*', (req, res) => {

    //check if url is a valid url
    if (isUrl(req.params[0], {requireProtocol: true})) {

        //create model and save urls from request
        var url = new Url();
        url.full_url = req.params[0];
        url.short_url = req.protocol + '://' + req.get('host') + '/' + perma(url.full_url, 3);

        url.save((err) => {
            if (err) {
                // duplicate entry
                if (err.code == 11000)

                    // if duplicate just show the result
                    return res.json({
                        full_url: url.full_url,
                        short_url: url.short_url
                    })
                
                else
                    return res.send(err);
            }

            // show the result
            res.json({
                full_url: url.full_url,
                short_url: url.short_url
            })
        })

    } else {

        // if the format of request is wrong show the error
        res.json({
            error: "Wrong url format, please check it and try again"
        })   
    }
});

// any other request that is not (/new or /) will redirect us to the shortened url
app.get('/*', (req, res) => {
    
    var short_url = req.protocol + '://' + req.get('host') + req.originalUrl

    // search for the url in our databse
    Url.findOne({ short_url: short_url}, function (err, doc){
        
        // if the url in out database redirect to that url
        if (doc) {
            res.redirect(doc.full_url)

        // else show the error or it will crash the app
        } else {
            res.json({error: "sorry, no such url in the database"})
        }
    });
});


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})