const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BtomInfo = new Schema({
    telephone:{
        type:String
    },
    weburl:{
        type:String
    },
    address:{
        type:String
    },
    icp:{
        type:String
    },
    erweima:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = BtomInfoc = mongoose.model('bottominfo',BtomInfo);