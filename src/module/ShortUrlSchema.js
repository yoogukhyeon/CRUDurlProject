const mongoose = require('mongoose');
//short id
const shortid = require('shortid');


const ShortUrlSchema = new mongoose.Schema({
    full : {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
        default: shortid.generate
    },
    clicks: {
        type: Number,
        require: true,
        default: 0
    }
})

module.exports = mongoose.model('UrlSchema' , ShortUrlSchema) 