//创建模型
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//创建Schema 所需要的字段
const Navigation = new Schema({
    secondarydata:{
      type:Array
    },
    name:{ //顶级菜单
        type:String
    },
    hyperlins:{ //顶级超链接
        type:String
    },
    lower:{ //二级菜单
        type:String
    },
    lowerhyperlins:{ //二级菜单超链接
        type:String
    },
    date:{ //时间
        type:Date,
        default:Date.now
    }
})

module.exports = Navigations = mongoose.model('navigation',Navigation); //公出