var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')

// 引入token相关
var vertoken = require('./token/token_vertify')
var expressJwt = require('express-jwt')

//引入处理跨域中间件
var cors = require('cors')

//各路由加载
const adminRouter = require('./routes/getAdmin')
const userRouter = require('./routes/getUser')
const parkingRouter = require('./routes/getParking')
const historyRouter = require('./routes/getHistory')
const dealWechatRouter = require('./routes/dealWithWechat')
const dealRaspiRouter = require('./routes/dealWithRaspi')
const paymentWithWechat = require('./routes/paymentWithWechat')

// 创建express对象
var app = express()

// 处理跨域
app.use(cors())

//配置解析表单Post请求体插件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//解析token
app.use(function(req,res,next){
    var token = req.headers['authorization']
    if(token == undefined){
        return next()
    }else{
        vertoken.verToken(token).then(data=>{
            req.data = data
            return next()
        }).catch(error=>{
            return res.status(200).json({
                err_code:2,
                message:'发生错误'
            })
        })
    }
})

//路由挂载
app.use(adminRouter)
app.use(userRouter)
app.use(parkingRouter)
app.use(historyRouter)
app.use(dealWechatRouter)
app.use(dealRaspiRouter)
app.use(paymentWithWechat)

//404配置
app.use(function(err,req,res,next){
    res.send('404')
})

app.listen(3024,function(){
    console.log('server running...')
})