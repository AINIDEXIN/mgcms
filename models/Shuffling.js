//创建模型
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Shuffling = new Schema({
    name:{
        type:String
    },
    url:{
        type:String
    },
    date:{
        type: Date,
        default:Date.now
    }
})

module.exports = Shufflings = mongoose.model('shuffling',Shuffling); //公出