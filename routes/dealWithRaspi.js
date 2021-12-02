var express= require('express')
var Car = require('../models/car')
var Parking = require('../models/parking')
var History = require('../models/history')

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
    var startTime
    // 设定离开时间
    var time = new Date()
    var outDate = time.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate() 
    
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

    // 记录startTime
    await Parking.find({
        carNum:body.carNum
    },function(err,parking){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        if(!parking){
            return res.status(200).json({
                err_code:1,
                message:'找不到该车'
            })
        }
        // 保存startTime
        startTime = parking.startTime
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

    // 缴纳费用统计
    var payment = (((parseInt(startTime)-time.getTime())/60000) < 30) ? 0 : parseInt((parseInt(startTime)-time.getTime())/1000000)

    // 更新car表
    await Car.findOneAndUpdate({
        carNum:body.carNum
    },{
        $inc:{ price: payment}
    },function(err,data){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
    })

    // 记录history表，根据日期判断插入or增加数据
    await History.findOneAndUpdate({
        date:outDate
    },{ 
           $push:{
               "contentList":{
                   carNum:body.carNum,
                   price:payment,
                   hasPay:false
               }
           }  
      },function(err,history){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        // 找到对应日期，成功插入数据，直接返回
        if(history){
            return res.status(200).json({
                err_code:0,
                message:`车辆${body.carNum}已离开`
            })
        }
    })

    // 没有对应的日期，新增一条数据
    // 创建一条新数据
    var newData = new History({
        data:outDate,
        contentList:[{
            carNum:body.carNum,
            price:payment,
            hasPay:false
        }]
    })
    // 保存数据
    newData.save(function(err,data){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }
        return res.status(200).json({
            err_code:0,
            message:`车辆${body.carNum}已离开`,
            data
        })        
    })

})


module.exports = router