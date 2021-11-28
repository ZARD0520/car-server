var express= require('express')
var History = require('../models/history')

var router = express.Router()

// 历史缴费记录
router.post('/getHistory',function(req,res){
    History.find(function(err,data){
        if(err){
            return res.status(500).json({
                success:false,
                message:'server error'
            })
        } else if(data == 0){
            return res.status(200).json({
                err_code:1,
                message:'无数据'
            })
        }
        return res.status(200).json({
            err_code:0,
            message:'历史缴费记录',
            data
        })
    })
})

// 今日缴费记录
router.post('/getToday',function(req,res){
    var body = req.body
    History.find({date:body.date},function(err,data){
        if(err){
            return res.status(500).json({
                success:false,
                message:'Server error'
            })
        } else if(data == 0){
            return res.status(200).json({
                err_code:1,
                message:'记录不存在'
            })
        }
        return res.status(200).json({
            err_code:0,
            message:'今日缴费记录',
            data
        })
    })
})

module.exports = router