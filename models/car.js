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
        require:true,
        default:false
    },
    isLock:{
        type:Boolean,
        require:true,
        default:false
    },
    price:{
        type:Number,
        require:true,
        default:0
    }
})

//导出模型
module.exports = mongoose.model('car',carSchema)
