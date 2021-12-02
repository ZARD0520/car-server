var jwt = require('jsonwebtoken')
var signkey = 'wezard_hgazx'  // 密钥


exports.setToken = function(username,id){
    return new Promise((resolve,reject)=>{
        const token = jwt.sign({
            name:username,
            _id:id
        },signkey,{expiresIn:'10h'})
        resolve(token)
    })
}

exports.verToken = function(token){
    return new Promise((resolve,reject)=>{
        var info = jwt.verify(token.split(',')[1],signkey,
            function(err,data){
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
            })
        console.log(info)
        resolve(info)
    })
}