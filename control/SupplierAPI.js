const express = require('express')
const router = express.Router()
const SupplierModel = require('../model/supplier')
const nameValidator = require('../validators/nameValidator')
const {sucess, fail} = require("../helpers/resposta")
const auth = require('../helpers/auth')

/*
 ? Supplier Permissões: 
 *   criar: admin
  *  alterar: admin
  *  deletar: admin
  *  listar: usuarios e admins
  *  procurar: usuarios e admins
 */

router.get('/list', auth.authenticate, (req, res) => {
    //parametros:
    const limite = parseInt(req.query.limite) || 10 //padrao 10 por pagina
    const pagina = parseInt(req.query.pagina) || 1 //padrao na pagina 1

    if (limite == 5 || limite == 10 || limite == 30){
        SupplierModel.listByPage(limite, pagina).then(lista =>{
            res.json(lista)
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar lista:" + erro.message))

        })
    } else {
        res.status(416).json(fail("Limite por página deve ser 5 OU 10 OU 30"))
    }
})

router.get('/search', nameValidator.validateName, auth.authenticate, (req, res) => {
    //body
    const name = req.body.name

    if (name != null && name != ''){
        SupplierModel.getByName(name).then(sup =>{
            if (sup != null){
                res.json({status: true, id: sup.id, supplier: sup.name})
            } else{
                res.status(400).json(fail("Supplier não encontrado"))
            }
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar Supplier:" +name+"| erro:"+ erro.message))

        })
    } else {
        res.status(416).json(fail("NAME não informado"))
    }
})

// ? Rota para Criar Sup
//antes /create
/*
body:{
    "name": "ajksdj"
}
*/
router.post('/', nameValidator.validateName, auth.authenticate, auth.isAdminAuth, (req, res) => {
    SupplierModel.save(req.body.name).then(sup => {
        res.json(sucess("Supplier Criado: "+sup.name))
    }).catch(erro => {
        res.status(400).json(fail("Falha ao Criar: "+erro.message))
    })
})

/*
update:
param -> name (do supplier a ser alterado) ou id
body : new name
*/
//antes /update
router.put('/', nameValidator.validateName, auth.authenticate, auth.isAdminAuth, (req, res) => {
    const name = req.query.name
    const id = parseInt(req.query.id)
    if (name != null && name != ''){
        SupplierModel.update(name, req.body.name).then(sup =>{
            res.json(sucess('Sup['+name+'] Alterado com sucesso'))
        }).catch(erro => {
            res.status(400).json(fail("Erro ao alterar supplier (Verifique se já há um supplier de mesmo nome):" + erro.message))
        })
    } else if (id != null && id != ''){
        SupplierModel.updateById(id, req.body.name).then(sup =>{
            res.json(sucess('Sup['+id+'] Alterado com sucesso'))
        }).catch(erro => {
            res.status(400).json(fail("Erro ao alterar supplier (Verifique se já há um supplier de mesmo nome):" + erro.message))
        })
    } else{
        res.status(416).json(fail("NAME OR ID não informado"))
    }
})
//antes /delete
router.delete('/', auth.authenticate, auth.isAdminAuth, (req, res) => {
    //parametro
    const name = req.query.name
    const id = parseInt(req.query.id)
    if (name != null && name != ''){
        SupplierModel.delete(name).then(sup =>{
            res.json(sucess('Sup['+name+'] Deletado com sucesso'))
        }).catch(erro => {
            res.status(400).json(fail("Erro ao alterar supplier:" + erro.message))
        })
    } else if (id != null && id != ''){
        SupplierModel.deleteById(id).then(sup =>{
            res.json(sucess('Sup['+id+'] Deletado com sucesso'))
        }).catch(erro => {
            res.status(400).json(fail("Erro ao alterar supplier:" + erro.message))
        })
    } else{
        res.status(416).json(fail("NAME OR ID não informado"))
    }
})

module.exports = router