var express= require('express')
var Admin = require('../models/admin')
var md5 = require('blueimp-md5')

var router = express.Router()

//登录请求
router.post('/loginAdmin',function(req,res){
    //获取表单数据、查询数据库用户密码是否正确、响应数据
    var body = req.body
    Admin.findOne({
        username:body.username,
        password:md5(md5(body.password))
    },function(err,admin){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        //如果不存在该用户
        if(!admin){
            return res.status(200).json({
                err_code:1,
                message:'用户或密码不存在'
            })
        }
        //如果用户存在，则成功登录，记录一个登录态
        req.session.admin = admin

        res.status(200).json({
            err_code:0,
            message:'登录成功'
        })
    })
})

module.exports = router