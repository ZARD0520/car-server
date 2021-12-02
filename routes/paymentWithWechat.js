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

//-----------------------------------------------
    // history表改变hasPay
    /*
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
        obj = data
    })
    
    // 遍历更新数据
    obj.forEach((item)=>{
        item.contentList.forEach((cItem)=>{
            if(cItem.carNum === body.carNum){
                cItem.hasPay = true
            }
        })
    })

    // 更新整个history表
    */
//-----------------------------------------------

    // 方法二，利用updateMany
    History.updateMany({
        'contentList.carNum':body.carNum
    },{ $set:{ 'contentList.hasPay':true } },function(err,data){
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
        return res.status(200).json({
            err_code:0,
            message:'缴纳成功',
            data
        })
    })
    
})


// 历史缴纳记录(遍历获取对应数据)
router.post('/getHistoryPayment',function(req,res){
    var body = req.body
    var obj
    var historyPay=[]
    History.find(function(err,data){
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
        obj = data
    })
    
    obj.forEach((item)=>{
        item.contentList.forEach((cItem)=>{
            if(cItem.carNum === body.carNum){
                let objItem = cItem
                objItem.date = item.date
                historyPay.push(objItem)
            }
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