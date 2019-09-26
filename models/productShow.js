//创建模型
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productShow = new Schema({
    name:{
        type:String
    },
    productImg:{
        type: String
    },
    content:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = Productc = mongoose.model('productshow',productShow)