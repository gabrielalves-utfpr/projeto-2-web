const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const userValidator = require('../validators/userValidator')
const {sucess, fail} = require("../helpers/resposta")
const auth = require('../helpers/auth')

router.get('/', auth.authenticate, auth.isAdminAuth, async (req, res) => {
    return res.json({status: true, username: req.user.username, isAdmin: await UserModel.isAdmin(req.user.username)})
})
//Rota para Criar Usuário ou Admin
//Necessário ser admin
router.post('/create', userValidator.validateUser, auth.authenticate, auth.isAdminAuth, (req, res) => {
    UserModel.save(req.body).then(user => {
        if (req.body.administrador == true){
            UserModel.toAdmin(user.username).then(() => {
                res.json(sucess("Admin Criado"))
            }).catch(erro => {
                res.status(405).json(fail("Falha ao Criar Admin"))

            })
        } else{
            res.json(sucess("Usuário Criado"))
        }
    }).catch(erro => {
        res.status(401).json(fail("Falha ao Cadastrar"))
    })
})
router.get('/list', auth.authenticate, auth.isAdminAuth, (req, res) => {
    UserModel.list().then(lista =>{
        res.json(lista)
    }).catch(erro => {
        res.status(400).json(fail("Erro ao solicitar lista:" + erro.name))

    })
})

/*
    router.get('/', (req, res) => {
        return res.json(fail("Nothing here"))
    })
*/
module.exports = router