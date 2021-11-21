//超级管理员
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/car',{useMongooClient:true})

var adminSchema = new Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    }
})

//导出模型
module.exports = mongoose.model('Admin',adminSchema)


