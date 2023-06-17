const UserModel = require('../model/user')
const jwt = require('jsonwebtoken')

module.exports = {
    authenticate: async function(req, res, next){
        let reqbearer = req.headers['authorization']
        let bearer = reqbearer.split(' ')
        if (bearer[0] != 'Bearer') {
            return res.status(400).json({status:false, mensagem:"Não à Bearer"})
        }
        jwt.verify(bearer[1], process.env.SECRET, (erro, user) =>{
            if(erro){
                    return res.status(401).json({status:false, mensagem:erro.name})
            }
            req.user = user
        })
        if(req.user != null){
            let user = await UserModel.isRegistered({username: req.user.username, password: req.user.password})
            if (user != null){
                next()
            }else{
                return res.status(401).json({status:false, mensagem:'Credenciais erradas'})
            }
        }
    }

}