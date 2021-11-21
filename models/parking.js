var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/car',{useMongooClient:true})

var parkingSchema = new Schema({
    parklot:{
        type:String,
        require:true
    },
    hasCar:{
        type:Boolean,
        require:true
    },
    carNum:{
        type:String
    },
    startTime:{
        type:String
    }
})

//导出模型
module.exports = mongoose.model('Parking',parkingSchema)