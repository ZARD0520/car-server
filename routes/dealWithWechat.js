var express= require('express')
var md5 = require('blueimp-md5')
var User = require('../models/user')
var Car = require('../models/car')
var Parking = require('../models/parking')
 
var router = express.Router()

// 查看锁定状态
router.post('/getLockStatus',async function(req,res){
    var body = req.body
    var statusInfo = {}
    await Car.findOne({ 
        username:body.username 
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
        // 车辆存在，给返回对象添加Car相关信息
        statusInfo.carInfo = car
    })
    await Parking.findOne({
        carNum:statusInfo.carInfo.carNum
    },function(err,data){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        if(!data){
            return res.status(200).json({
                err_code:1,
                message:'车辆不在停车场'
            })
        }
        statusInfo.startTime = data.startTime
        return res.status(200).json({
            err_code:0,
            message:'车辆信息',
            data:statusInfo
        })
    })
})


// 锁定
router.post('/setLock',async function(req,res){
    // 给User、Car锁定状态
    var body = req.body
    var user
    // User表更新
    await User.findOneAndUpdate({
        username:body.username
    },{ isLock:true },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        //如果不存在该用户
        if(!user){
            return res.status(200).json({
                err_code:1,
                message:'用户不存在，锁定失败'
            })
        }
    })
    // Car表更新
    await Car.findOneAndUpdate({
        username:body.username
    },{ isLock:true },function(err,car){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
         //如果不存在该车辆
        if(!car){
            return res.status(200).json({
                err_code:1,
                message:'车辆不存在，锁定失败'
            })
        }
        return res.status(200).json({
            err_code:0,
            message:'更新成功',
            data:car
        })
    })
})

// 开锁
router.post('/setUnLock',async function(req,res){
    // 给User、Car解锁状态
    var body = req.body
    var user
    // User表更新
    await User.findOneAndUpdate({
        username:body.username
    },{ isLock:false },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        //如果不存在该用户
        if(!user){
            return res.status(200).json({
                err_code:1,
                message:'用户不存在，锁定失败'
            })
        }
    })
    // Car表更新
    await Car.findOneAndUpdate({
        username:body.username
    },{ isLock:false },function(err,car){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
         //如果不存在该车辆
        if(!car){
            return res.status(200).json({
                err_code:1,
                message:'车辆不存在，锁定失败'
            })
        }
        return res.status(200).json({
            err_code:0,
            message:'更新成功',
            data:car
        })
    })
})

module.exports = router
