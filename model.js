const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Url_Schema = new Schema({
    full_url: { type: String, index: { unique: true }},
    short_url: String
})

module.exports = mongoose.model('Url', Url_Schema)