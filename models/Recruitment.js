const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Recruitment = new Schema({
    name:{
        type:String
    },
    describe:{
        type: String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = Describec = mongoose.model('recruitment',Recruitment);