const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const userValidator = require('../validators/userValidator')
const {sucess, fail} = require("../helpers/resposta")
const auth = require('../helpers/auth')

router.get('/', auth.authenticate, async (req, res) => {
    return res.json({status: true, username: req.user.username, isAdmin: await UserModel.isAdmin(req.user.username)})
})

/*
    router.get('/', (req, res) => {
        return res.json(fail("Nothing here"))
    })
*/
module.exports = router