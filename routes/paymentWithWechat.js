var express= require('express')
var Car = require('../models/car')
var History = require('../models/history')

var router = express.Router()

// 缴纳费用查询
router.post('/getPayment',function(req,res){
    var body = req.body
    Car.find({
        username:body.username
    },function(err,data){
        if(err){
            return res.status(500).json({
                success:false,
                message:'server error'
            })
        }
        if(!data){
            return res.status(200).json({
                err_code:1,
                message:'无数据'
            })
        }
        return res.status(200).json({
            err_code:0,
            message:'需缴纳费用',
            data
        })
    })
})

// 缴纳费用
router.post('/payPrice',async function(req,res){
    var body = req.body
    var obj
    var date = new Date()
    var time = date.getTime().toString()

    // car表清零
    await Car.findOneAndUpdate({
        carNum:body.carNum
    },{
        price:0
    },function(err,data){
        if(err){
            return res.status(500).json({
                success:false,
                message:'server error'
            })
        }
        if(!data){
            return res.status(200).json({
                err_code:1,
                message:'没有该车辆'
            })
        }
    })


    // updateMany
    History.updateMany({
        'contentList.carNum':body.carNum
    },{ 
        '$set':{ 
            'contentList.$.hasPay':true,
            'contentList.$.payTime':time
        } 
    },function(err,data){
        if(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:'server error'
            })
        } else if(!data){
            return res.status(200).json({
                err_code:1,
                message:'无数据'
            })
        }
        return res.status(200).json({
            err_code:0,
            message:'缴纳成功',
            data
        })
    })
    
})


// 历史缴纳记录(遍历获取对应数据)
router.post('/getHistoryPayment',async function(req,res){
    var body = req.body
    var obj={}
    var carNum
    var historyPay=[]
    await History.find(function(err,data){
        if(err){
            return res.status(500).json({
                success:false,
                message:'server error'
            })
        } else if(!data){
            return res.status(200).json({
                err_code:1,
                message:'无数据'
            })
        }
        obj = JSON.parse(JSON.stringify(data))
    })

    await Car.find({
       username:body.username     
    },function(err,data){
        if(err){
            return res.status(500).json({
                success:false,
                message:'server error'
            })
        }
        if(!data){
            return res.status(200).json({
                err_code:1,
                message:'找不到该车辆'
            })
        }
        carNum = data[0].carNum
        obj.forEach((item)=>{
            item.contentList.forEach((cItem)=>{
                cItem['date'] = item.date
                if(cItem.carNum === carNum){
                    var objItem = cItem
                    historyPay.push(objItem)
                }
            })
        })
    })

    // 返回列表数据
    return res.status(200).json({
        err_code:0,
        message:'历史缴纳记录',
        data:historyPay
    })

})


module.exports = router