const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const LogoupSchema = new Schema({
    logo: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Logofile = mongoose.model('logoup', LogoupSchema);
