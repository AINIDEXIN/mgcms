//创建模型
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//创建 Schema
//创建登录和注册时需要的字段，需要什么创建什么
const Userchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    newPass:{
        type:String
    },
    avatar:{
        type:String
    },
    identity:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = User = mongoose.model('users',Userchema); //公出