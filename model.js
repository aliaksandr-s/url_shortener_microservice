const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UrlSchema = new Schema({
    fullUrl: String,
    shortUrl: String
})

module.exports = mongoose.model('Url', UrlSchema)