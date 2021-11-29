//超级管理员
var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/car',{useMongooClient:true})

var adminSchema = new Schema({
    user:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    }
})

//导出模型
module.exports = mongoose.model('admin',adminSchema)


