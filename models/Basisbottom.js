const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Basisbottom = new Schema({
    name:{
        type:String
    },
    hyperlink:{
        type:String
    },
    date:{
        type: Date,
        default:Date.now
    }
});

module.exports = Basisbottomc = mongoose.model('basisbottom',Basisbottom); //公出