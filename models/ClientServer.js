//创建模型
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientServer = new Schema({
    title:{
        type:String
    },
    ClientImg:{
        type:String
    },
    content:{
        type:String
    }
})

module.exports = ClientServers = mongoose.model('client',ClientServer);