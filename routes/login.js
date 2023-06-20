const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const userValidator = require('../validators/userValidator')
const {sucess, fail} = require("../helpers/resposta")
const jwt = require('jsonwebtoken')
const path = require('path');

/*
*Rota GET Página de Login: index.html
*/
router.get('/', (req, res) =>{
    res.sendFile(path.resolve(__dirname, '../view/index.html'));
})

/*
*Rota POST de Login
body:{
    'name': 'name',
    'password': password
}
*/
router.post('/', userValidator.validateUser, (req, res) => {
    const {username, password} = req.body
    UserModel.getByUserName(username).then(user => {
        if(user.password == password){
            let token = jwt.sign({username: username, password: password}, process.env.SECRET, {expiresIn: "5h"})
            res.json(sucess(token, 'token'))
        }else{
            res.status(401).json(fail("Password Incorreto"))
        }
    }).catch(erro => {
        res.status(401).json(fail("Usuário Incorreto"))
    })
})
/*
*Rota POST de Cadastro
body:{
    'name': 'name',
    'password': password
}
*/
router.post('/subscribe', userValidator.validateUser, (req, res) => {
    UserModel.save(req.body).then(user => {
        let token = jwt.sign({username: user.username, password: user.password}, process.env.SECRET, {expiresIn: "5h"})
        res.json(sucess(token, 'token'))
    }).catch(error => {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(403).json({ status: false, message: "USERNAME JÁ EXISTE"});
        } else {
        res.status(400).json(fail("Falha ao Cadastrar"))
        }
    })
})

module.exports = router