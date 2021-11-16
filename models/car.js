var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/zard',{useMongooClient:true})

var carSchema = new Schema({
    carNum:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    }
})

//导出模型
module.exports = mongoose.model('Car',carSchema)
