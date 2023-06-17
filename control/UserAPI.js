const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const userValidator = require('../validators/userValidator')
const {sucess, fail} = require("../helpers/resposta")
const jwt = require('jsonwebtoken')
const auth = require('../helpers/auth')

router.get('/', auth.authenticate, (req, res) => {
    const {username, password} = req.user
    return res.json({status: true, username: username, password: password})
})

router.post('/subscribe', userValidator.validateUser, (req, res) => {
    UserModel.save(req.body).then(user => {
        res.json(sucess(user))
    }).catch(erro => {
        res.status(401).json(fail("Falha ao Cadastrar"))
    })
})
/*
    router.get('/', (req, res) => {
        return res.json(fail("Nothing here"))
    })
*/
module.exports = router