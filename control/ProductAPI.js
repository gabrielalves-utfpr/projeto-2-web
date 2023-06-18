const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const userValidator = require('../validators/userValidator')
const {sucess, fail} = require("../helpers/resposta")
const auth = require('../helpers/auth')

/*
 ? Product Permissões: 
    criar: admin
    alterar: admin
    deletar: admin
    listar: usuarios e admins
    procurar: usuarios e admins
    buy: usuarios e admins
 */

router.get('/', auth.authenticate, auth.isAdminAuth, async (req, res) => {
    return res.json({status: true, username: req.user.username, isAdmin: await UserModel.isAdmin(req.user.username)})
})


router.get('/list', auth.authenticate, auth.isAdminAuth, (req, res) => {
    //parametros:
    const limite = parseInt(req.query.limite) || 10 //padrao 10 por pagina
    const pagina = parseInt(req.query.pagina) || 1 //padrao na pagina 1

    if (limite == 5 || limite == 10 || limite == 30){
        UserModel.listByPage(limite, pagina).then(lista =>{
            res.json(lista)
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar lista:" + erro.message))

        })
    } else {
        res.status(416).json(fail("Limite deve ser 5 OU 10 OU 30"))
    }
})

router.get('/search', auth.authenticate, auth.isAdminAuth, (req, res) => {
    //parametro
    const username = req.query.username

    if (username != null && username != ''){
        UserModel.getByUserName(username).then(user =>{
            if (user != null){
                res.json({status: true, username: user.username, administrador: user.administrador})
            } else{
                res.status(400).json(fail("Usuário não encontrado"))
            }
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar usuario:" + erro.message))

        })
    } else {
        res.status(416).json(fail("USERNAME não informado"))
    }
})

// ? Rota para Criar Produto
//antes /create
/*
body:{
    "username": "ajksdj"
    "password": "ajksdj"
    "administrador": true
}
*/
router.post('/', userValidator.validateUser, auth.authenticate, auth.isAdminAuth, (req, res) => {
    UserModel.save(req.body).then(user => {
        if (req.body.administrador == true){
            UserModel.toAdmin(user.username).then(() => {
                res.json(sucess("Admin Criado"))
            }).catch(erro => {
                res.status(405).json(fail("Usuário criado porém Falha ao Tornar Usuário Admin"))
            })
        } else{
            res.json(sucess("Usuário Criado"))
        }
    }).catch(erro => {
        res.status(401).json(fail("Falha ao Cadastrar"))
    })
})

/*
update:
param -> Username (do usuário a ser alterado)
body : new or old username e new or old password
*/
//antes /update
router.put('/', userValidator.validateUser, auth.authenticate, auth.isAdminAuth, (req, res) => {
    const username = req.query.username
    if (username != null && username != ''){
        UserModel.getByUserName(username).then(user =>{
            let obj = {username: req.body.username, password: req.body.password}
            if(user.administrador != true || req.user.username == user.username){
                UserModel.update(user.username, obj).then(user =>{
                    res.json(sucess('Alterado com sucesso'))
                }).catch(erro => {
                    res.status(400).json(fail("Erro ao alterar usuario:" + erro.message))
                })
            }else{
                res.status(401).json(fail("Não é possível alterar outro admin"))
            }
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar usuario:" + erro.message))
        })
    } else {
        res.status(416).json(fail("USERNAME não informado"))
    }
})
//antes /delete
router.delete('/', auth.authenticate, auth.isAdminAuth, (req, res) => {
    //parametro
    const username = req.query.username

    if (username != null && username != ''){
        UserModel.getByUserName(username).then(user =>{
            if(user.administrador != true || req.user.username == user.username){
                UserModel.delete(user.username).then(result =>{
                    res.json(sucess('Usuário ('+user.username+') deletado com sucesso'))
                }).catch(erro => {
                    res.status(400).json(fail("Erro ao Deletar Usuário:" + erro.message))
                })
            }else{
                res.status(401).json(fail("Não é possível deletar outro admin"))
            }
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar usuario:" + erro.message))
        })
    } else {
        res.status(416).json(fail("USERNAME não informado"))
    }
})

module.exports = router