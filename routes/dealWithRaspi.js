var express= require('express')
var Car = require('../models/car')
var Parking = require('../models/parking')

var router = express.Router()

// 车辆进入
router.post('/carIn',async function(req,res){
    var body = req.body

    // 查询车辆状态，若已进入则重新请求离开接口
    await Car.find({
        carNum:body.carNum
    },function(err,car){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        // 车辆不存在
        if(!car){
            return res.status(200).json({
                err_code:1,
                message:'车辆不存在'
            })
        }
        if(car.status){
            return res.status(100).json({
               err_code:100,
               message:'车辆请求离开'
            })
        }
    })

    // 查询车牌相关信息
    await Car.findOneAndUpdate({
        carNum:body.carNum
    },{ status:true },function(err,car){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        // 车辆不存在
        if(!car){
            return res.status(200).json({
                err_code:1,
                message:'车辆不存在'
            })
        }
    })

    // 设定开始停放时间
    let time = new Date()
    let startTime = time.getTime().toString()

    // 查找到车牌，然后查找空车位，更新parking表
    await Parking.findOneAndUpdate({
        hasCar:false
    },{
        hasCar:true,
        carNum:body.carNum,
        startTime
    },function(err,parklot){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        // 找不到空车位，车位已满
        if(!parklot){
            return res.status(200).json({
                err_code:1,
                message:'车位已满'
            })
        }
    })
    
    // 返回空车位信息
    return res.status(200).json({
        err_code:0,
        message:`欢迎，${body.carNum}，请前往${parklot.parklot}号车位`,
    })

})


//车辆离开
router.post('/carOut',async function(req,res){
    var body = req.body
    
    // 查询车辆相关信息，并更新car表
    await Car.findOneAndUpdate({
        carNum:body.carNum
    },{ status:false },function(err,car){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        // 车辆不存在
        if(!car){
            return res.status(200).json({
                err_code:1,
                message:'车辆不存在'
            })
        }
    })

    // 记录parking表
    await Parking.findOneAndUpdate({
        carNum:body.carNum
    },{
        hasCar:false,
        carNum:'',
        startTime:''
    },function(err,parklot){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        // 找不到该车
        if(!parklot){
            return res.status(200).json({
                err_code:1,
                message:'找不到该车'
            })
        }
    })

    // 记录history表，根据日期判断插入or增加数据


})


module.exports = router