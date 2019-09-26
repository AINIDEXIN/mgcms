const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Company = new Schema({
    company_img:{
        type:String
    },
    conpany_content:{
        type: String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = Companyfind = mongoose.model('Company',Company);