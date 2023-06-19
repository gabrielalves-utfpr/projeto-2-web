const express = require('express')
const router = express.Router()
const UserModel = require('../model/user')
const userValidator = require('../validators/userValidator')
const {sucess, fail} = require("../helpers/resposta")
const auth = require('../helpers/auth')
const path = require('path');

/*
 ? User Permissões: 
    criar: cadastro por /login/cadastro
    alterar: a si proprio
    deletar: a si proprio
 */

router.get('/', auth.authenticate, async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../view/home.html'));
})
/*
update:
body : new/old username e new/old password
*/
//antes /update
router.put('/', userValidator.validateUser, auth.authenticate, (req, res) => {
        let obj = {username: req.body.username, password: req.body.password}
        UserModel.getByUserName(req.user.username).then(user =>{
                UserModel.update(user.username, obj).then(response =>{
                    res.json(sucess('Alterado com sucesso! Refaça o login'))
                }).catch(erro => {
                    res.status(400).json(fail("Erro ao alterar usuario:" + erro.message))
                })
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar usuario:" + erro.message))
        })
})
//antes /delete
router.delete('/', auth.authenticate, (req, res) => {
    //parametro
    const username = req.query.username

    if (username != null && username != ''){
        UserModel.getByUserName(username).then(user =>{
            if(req.user.username == user.username){
                UserModel.delete(user.username).then(result =>{
                    res.json(sucess('Usuário ('+user.username+') deletado com sucesso'))
                }).catch(erro => {
                    res.status(400).json(fail("Erro ao Deletar Usuário:" + erro.message))
                })
            }else{
                res.status(401).json(fail("Não é possível deletar outro usuário"))
            }
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar usuario:" + erro.message))
        })
    } else {
        res.status(416).json(fail("USERNAME não informado"))
    }
})
module.exports = router