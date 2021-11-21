var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/car',{useMongooClient:true})

var historySchema = new Schema({
    date:{
        type:String,
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