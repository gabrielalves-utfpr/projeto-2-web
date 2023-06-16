const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const userValidator = require('../validators/userValidator')
const {sucess, fail} = require("../helpers/resposta")

router.post('/', userValidator.validateUser, (req, res) => {
    const {username, password} = req.body
    UserModel.getByUserName(username).then(user => {
        if(user.password == password){
            res.json(sucess("Login Sucessfull"))
        }else{
            res.status(401).json(fail("Password Incorreto"))
        }
    }).catch(erro => {
        res.status(401).json(fail("Usuário Incorreto"))
    })
})

router.post('/subscribe', userValidator.validateUser, (req, res) => {
    UserModel.save(req.body).then(user => {
        res.json(sucess(user))
    }).catch(erro => {
        res.status(401).json(fail("Falha ao Cadastrar"))
    })
})

router.get('/', (req, res) => {
    return res.json(fail("Usuário Incorreto"))
})

module.exports = router