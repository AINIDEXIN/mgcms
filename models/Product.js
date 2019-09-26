//创建模型
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    title:{ //标题
        type:String
    },
    icon:{ //图标
        type:String
    },
    content:{ //描述
        type:String
    },
    productdetails:{ //详情
        type:String
    },
    productdate:{ //添加时间
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = Productc = mongoose.model('roduct',Product)