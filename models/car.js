var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/car',{useMongooClient:true})

var carSchema = new Schema({
    carNum:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    },
    isLock:{
        type:Boolean,
        require:true
    }
})

//导出模型
module.exports = mongoose.model('car',carSchema)
