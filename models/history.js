var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/zard',{useMongooClient:true})

var historySchema = new Schema({
    date:{
        type:Date,
        require:true
    },
    contentList:[{
        carNum:String,
        price:String,
        hasPay:Boolean,
        payTime:Date
    }]
})

//导出模型
module.exports = mongoose.model('History',historySchema)