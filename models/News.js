//创建模型
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const News = new Schema({
    title:{ //标题
        type:String
    },
    content:{ //内容
        type:String
    },
    details:{ //详情
        type:String
    },
    tgbnhyy:{
        type:String
    },
    author:{ //作者
        type:String
    },
    releasedate:{ //发布时间
        type:String
    },
    thumbnailimg:{ //图片
        type:String
    },
    date:{
        type: Date,
        default:Date.now
    }
});

module.exports = Newss = mongoose.model('news',News); //公出