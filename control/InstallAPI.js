const express = require("express")
const router = express.Router()
const sequelize = require("../helpers/db")

const UserModel = require('../model/user')
const SupplierModel = require('../model/supplier')
const CategorieModel = require('../model/categorie')
const ProductModel = require('../model/product')

router.get('/', async (req, res) => {
    await sequelize.sync({ force: true })
    /*
    ? Tabela "User":
*   id	username	senha	    administrador
    1	João	    G9$@e5yP	true
    2	Maria	    jK#7*2v!	false
    3	Pedro	    X6@fR4tZ	false
    4	Ana 	    bQ%3&8wK	false
    5	Carlos	    L2!sF5pA	false
    */

    /*
    ? Tabela "Categorie":
*   id	nome
    1	Roupas
    2	Calçados
    3	Acessórios
    4	Eletrônicos
    5	Beleza
    */

    /*
    ? Tabela "Supplier":
*   id	nome
    1	Fornecedor A
    2	Fornecedor B
    3	Fornecedor C
    4	Fornecedor D
    5	Fornecedor E
    */

    /*
    ? Tabela "Product":
*   id	nome	    preço   QTD     idCat   idSupplier
    1	Camiseta	29.99   10      1       2
    2	Calça   	79.99   5       1       3
    3	Tênis	    99.99   12      2       1
    4	Celular	    59.99   3       4       5
    5	Batom	    39.99   7       5       5
    */
})

module.exports = router