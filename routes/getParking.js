var express= require('express')
var parking = require('../models/parking')

var router = express.Router()

router.post('/getParking',function(req,res){
    parking.find(function(err,data){
        if(err){
            return res.status(500).json({
                success:false,
                message:'server error'
            })
        } else if(data==0){
            return res.status(200).json({
                err_code:1,
                message:'无数据'
            })
        }
        return res.status(200).json({
            err_code:0,
            message:'show the 停车场状态',
            data
        })
    })
})


module.exports = router