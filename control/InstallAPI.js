const express = require("express")
const router = express.Router()
const sequelize = require("../helpers/db")

const UserModel = require('../model/user')
const SupplierModel = require('../model/supplier')
const CategorieModel = require('../model/categorie')
const ProductModel = require('../model/product')
const { sucess } = require("../helpers/resposta")

router.get('/', async (req, res) => {
    await sequelize.sync({ force: true })
    try {
    /*
    ? Tabela "User":
*   id	username	senha	    administrador
    1	admin	    admin   	true
    2	Maria	    jK#7*2v!	false
    3	Pedro	    X6@fR4tZ	false
    4	Ana 	    bQ%3&8wK	false
    5	Carlos	    L2!sF5pA	false
    */
    await UserModel.save({username: 'admin', password: 'admin'})
    await UserModel.toAdmin('admin')
    await UserModel.save({username: 'Maria', password: 'jK#7*2v!'})
    await UserModel.save({username: 'Pedro', password: 'X6@fR4tZ'})
    await UserModel.save({username: 'Ana', password: 'bQ%3&8wK'})
    await UserModel.save({username: 'Carlos', password: 'L2!sF5pA'})
    /*
    ? Tabela "Categorie":
*   id	nome
    1	Roupas
    2	Calçados
    3	Acessórios
    4	Eletrônicos
    5	Beleza
    */
    await CategorieModel.save('Roupas')
    await CategorieModel.save('Calçados')
    await CategorieModel.save('Acessórios')
    await CategorieModel.save('Eletrônicos')
    await CategorieModel.save('Beleza')

    /*
    ? Tabela "Supplier":
*   id	nome
    1	Fornecedor A
    2	Fornecedor B
    3	Fornecedor C
    4	Fornecedor D
    5	Fornecedor E
    */
    await SupplierModel.save('Fornecedor A')
    await SupplierModel.save('Fornecedor B')
    await SupplierModel.save('Fornecedor C')
    await SupplierModel.save('Fornecedor D')
    await SupplierModel.save('Fornecedor E')

    /*
    ? Tabela "Product":
*   id	nome	    preço   QTD     idCat   idSupplier
    1	Camiseta	29.99   10      1       2
    2	Calça   	79.99   5       1       3
    3	Tênis	    99.99   12      2       1
    4	Celular	    59.99   3       4       5
    5	Batom	    39.99   7       5       5
    */
    await ProductModel.saveObj({name: 'Camiseta', price: 29.99, qtd: 10, supplier: 2, categorie: 1})
    await ProductModel.saveObj({name: 'Calça', price: 79.99, qtd: 5, supplier: 3, categorie: 1})
    await ProductModel.saveObj({name: 'Tênis', price: 99.99, qtd: 12, supplier: 1, categorie: 2})
    await ProductModel.saveObj({name: 'Celular', price: 59.99, qtd: 3, supplier: 5, categorie: 4})
    await ProductModel.saveObj({name: 'Batom', price: 39.99, qtd: 7, supplier: 5, categorie: 5})

} catch (error) {
    res.json(fail('Falha ao Instalar Banco de Dados' + error.name))
}
    res.json(sucess('Banco Instalado com Sucesso'))
})

module.exports = router