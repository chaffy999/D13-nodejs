const authorization = require('auth-header')
const jwt = require('jsonwebtoken')

const authorize = async (req, res, next) => {
    const bearerHeader = authorization.parse(req.get('authorization'))
    console.log(bearerHeader)
    if(typeof bearerHeader != undefined){
        const bearerToken = bearerHeader.token
        jwt.verify(bearerToken, 'secretkey', (err, authData) =>{
            if(err){
                res.sendStatus(403)
            }
            next()
        })
    }else{
        res.sendStatus(403)
    }
}

module.exports = { authorize }