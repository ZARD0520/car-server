var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/car',{useMongooClient:true})

var userSchema = new Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    nickname:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    carNum:{
        type:String,
        require:true
    },
    isLock:{
        type:Boolean,
        require:true
    }
})

//导出模型
module.exports = mongoose.model('user',userSchema)






