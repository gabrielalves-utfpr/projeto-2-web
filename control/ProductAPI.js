const express = require('express')
const router = express.Router()
const ProductModel = require('../model/product')
const productValidator = require('../validators/productValidator')
const {sucess, fail} = require("../helpers/resposta")
const auth = require('../helpers/auth')

/*
 ? Product Permissões: 
 *   criar: admin
 *   alterar: admin
 *   deletar: admin
 *   listar: usuarios e admins
 *   procurar: usuarios e admins
 *   procurar Por Categoria/Supplier: usuarios e admins
 *   buy: usuarios e admins
 */
/*
*Rota GET Listagem de Produtos "/list"
    parametros:
        limite
        pagina
*/
router.get('/list', auth.authenticate, (req, res) => {
    //parametros:
    const limite = parseInt(req.query.limite) || 10 //padrao 10 por pagina
    const pagina = parseInt(req.query.pagina) || 1 //padrao na pagina 1

    if (limite == 5 || limite == 10 || limite == 30){
        ProductModel.listByPage(limite, pagina).then(lista =>{
            res.json(lista)
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar lista:" + erro.message))

        })
    } else {
        res.status(416).json(fail("Limite deve ser 5 OU 10 OU 30"))
    }
})
/*
*Rota GET Listagem de Produtos por Categoria "/list/categorie"
    parametros:
        limite
        pagina
        filterId: Id da categoria do filtro
*/
router.get('/list/categorie', auth.authenticate, (req, res) => {
    //parametros:
    /*
    limite: INT
    pagina: INT
    filterId: INT
    */
    const limite = parseInt(req.query.limite) || 10 //padrao 10 por pagina
    const pagina = parseInt(req.query.pagina) || 1 //padrao na pagina 1
    const filterId = parseInt(req.query.filterId) || 1 //padrao na pagina 1

    if (limite == 5 || limite == 10 || limite == 30){
        ProductModel.listByPageByCat(limite, pagina, filterId).then(lista =>{
            res.json(lista)
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar lista:" + erro.message))

        })
    } else {
        res.status(416).json(fail("Limite deve ser 5 OU 10 OU 30"))
    }
})
/*
*Rota GET Listagem de Produtos por Fornecedor "/list/supplier"
    parametros:
        limite
        pagina
        filterId: Id da supplier do filtro
*/
router.get('/list/supplier', auth.authenticate, (req, res) => {
    //parametros:
    /*
    limite: INT
    pagina: INT
    filterId: INT
    */
    const limite = parseInt(req.query.limite) || 10 //padrao 10 por pagina
    const pagina = parseInt(req.query.pagina) || 1 //padrao na pagina 1
    const filterId = parseInt(req.query.filterId) || 1 //padrao na pagina 1

    if (limite == 5 || limite == 10 || limite == 30){
        ProductModel.listByPageBySup(limite, pagina, filterId).then(lista =>{
            res.json(lista)
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar lista:" + erro.message))

        })
    } else {
        res.status(416).json(fail("Limite deve ser 5 OU 10 OU 30"))
    }
})
/*
*Rota GET Busca de Produto por nome "/search"
    parametros:
        name: nome do produto
*/

router.get('/search', auth.authenticate, auth.isAdminAuth, (req, res) => {
    //parametro
    const name = req.query.name

    if (name != null && name != ''){
        ProductModel.getByName(name).then(prod =>{
            if (prod != null){
                res.json({status: true, product: prod})
            } else{
                res.status(400).json(fail("Produto não encontrado"))
            }
        }).catch(erro => {
            res.status(400).json(fail("Erro ao solicitar Produto:" + erro.message))

        })
    } else {
        res.status(416).json(fail("NAME não informado"))
    }
})
/*
* Rota POST para Criar Produto
body:{
    'name': 'name',
    'price': price,
    'qtd': qtd,
    'supplier': 'supplier',
    'categorie': 'categorie'
}
*/
router.post('/', productValidator.validateProduct, auth.authenticate, auth.isAdminAuth, (req, res) => {
    ProductModel.saveObj(req.body).then(prod => {
        res.json(sucess("Produto'"+prod.name+"' Cadastrado"))
    }).catch(erro => {
        res.status(401).json(fail("Falha ao Cadastrar"))
    })
})

/*
*Rota DELETE Remoção de Produto por nome ou id "/"
    *PODE SER UTILIZADO OU O NOME DO PRODUTO OU ID
    parametros:
        name: nome do produto
        id: id do produto
*/
router.delete('/', auth.authenticate, auth.isAdminAuth, (req, res) => {
    //parametro
    const name = req.query.name
    const id = parseInt(req.query.id)
    if (name != null && name != ''){
        ProductModel.delete(name).then(prod =>{
            res.json(sucess('Produto['+name+'] Deletado com sucesso'))
        }).catch(erro => {
            res.status(400).json(fail("Erro ao alterar product:" + erro.message))
        })
    } else if (id != null && id != ''){
        ProductModel.deleteById(id).then(prod =>{
            res.json(sucess('Produto['+id+'] Deletado com sucesso'))
        }).catch(erro => {
            res.status(400).json(fail("Erro ao alterar product:" + erro.message))
        })
    } else{
        res.status(412).json(fail("NAME OR ID não informado"))
    }
})
/*
*Rota PUT Compra de Produto por nome ou id "/buy"
    *PODE SER UTILIZADO OU O NOME DO PRODUTO OU ID
    parametros:
        name: nome do produto
        id: id do produto
        qtd: quantidade a ser comprado
*/

router.put('/buy', auth.authenticate, async (req, res) => {
    //parametro
    const name = req.query.name
    const id = parseInt(req.query.id)
    const qtd = parseInt(req.query.qtd) // quantidade a ser comprada
    if (qtd != null && qtd > 0){
        if (name != null && name != ''){
            ProductModel.getByName(name).then(prod =>{
                ProductModel.buy(res, {name: prod.name, qtd: qtd}).then(prod => {
                    
                }).catch(erro =>{
                    if(!res.headersSent)res.status(400).json(fail("Erro ao solicitar Produto:" +name+"| erro:"+ erro.message))
                })
            }).catch(erro => {
                if(!res.headersSent)res.status(400).json(fail("Produto Não Encontrado:" + erro.message))
            })
        } else if (id != null && id != ''){
            ProductModel.getById(id).then( async prod =>{
                let resposta = await ProductModel.buy({name: prod.name, qtd: qtd})
                res.json(resposta)
                console.log(resposta)
                
            }).catch(erro => {
                if(!res.headersSent)res.status(400).json(fail("Produto Não Encontrado:" + erro.message))
            })
        } else{
            res.status(412).json(fail("NAME OR ID não informado"))
        }
    }else{
        res.status(412).json(fail("QTD não informado ou menos que 0"))
    }
});

/*
*Rota PUT Atualiza de Produto por nome ou id "/update"
    *PODE SER UTILIZADO OU O NOME DO PRODUTO OU ID
    parametros:
        name: nome do produto a ser alterado
        id: id do produto a ser alterado
    body:{
    'name': 'name', (novo ou antigo)
    'price': price, (novo ou antigo)
    'qtd': qtd, (novo ou antigo)
}
*/
router.put('/update', productValidator.validateUpProduct, auth.authenticate, auth.isAdminAuth, (req, res) => {
    const name = req.query.name
    const id = parseInt(req.query.id)
    if (name != null && name != ''){
        ProductModel.update(name, req.body).then(prod =>{
            res.json(sucess('Produto['+name+'] Alterado com sucesso'))
        }).catch(erro => {
            res.status(400).json(fail("Erro ao alterar Produto (Verifique se já há um Produto de mesmo nome):" + erro.message))
        })
    } else if (id != null && id != ''){
        ProductModel.updateById(id, req.body).then(prod =>{
            res.json(sucess('Produto['+id+'] Alterado com sucesso'))
        }).catch(erro => {
            res.status(400).json(fail("Erro ao alterar Produto (Verifique se já há um Produto de mesmo nome):" + erro.message))
        })
    } else{
        res.status(412).json(fail("NAME OR ID não informado"))
    }
})
/*
*Rota PUT Atualiza o PREÇO do Produto por nome ou id "/update/price"
    *PODE SER UTILIZADO OU O NOME DO PRODUTO OU ID
    parametros:
        name: nome do produto a ser alterado
        id: id do produto a ser alterado
    body:{
    'price': price, (novo)
}
*/
router.put('/update/price', auth.authenticate, auth.isAdminAuth, (req, res) => {
    const name = req.query.name
    const id = parseInt(req.query.id)
    const price = req.body.price
    if (price != null && price >= 0){
        if (name != null && name != ''){
            ProductModel.changePrice(name, price).then(prod =>{
                res.json(sucess('Produto['+name+'] Alterado com sucesso'))
            }).catch(erro => {
                res.status(400).json(fail("Erro ao alterar Produto (Verifique se já há um Produto de mesmo nome):" + erro.message))
            })
        } else if (id != null && id != ''){
            ProductModel.changePriceById(id, price).then(prod =>{
                res.json(sucess('Produto['+id+'] Alterado com sucesso'))
            }).catch(erro => {
                res.status(400).json(fail("Erro ao alterar Produto (Verifique se já há um Produto de mesmo nome):" + erro.message))
            })
        } else{
            res.status(412).json(fail("NAME OR ID não informado"))
        }
    }else {
        res.status(400).json(fail("Informe um preço válido"))
    }
})

module.exports = router