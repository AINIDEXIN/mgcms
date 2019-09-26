//创建模型
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//创建Schema
const Administrator = new Schema({
    user:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: true
    },
    identity:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = Administratork = mongoose.model('administrator',Administrator);