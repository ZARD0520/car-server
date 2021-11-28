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
        payTime:String
    }]
})

//导出模型
module.exports = mongoose.model('history',historySchema)