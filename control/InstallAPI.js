const express = require("express")
const router = express.Router()

router.get('/', async (req, res) => {
    /*
    ? Tabela "Users":
*   id	nome	senha	    administrador
    1	João	G9$@e5yP	true
    2	Maria	jK#7*2v!	false
    3	Pedro	X6@fR4tZ	false
    4	Ana 	bQ%3&8wK	false
    5	Carlos	L2!sF5pA	false

    ? Tabela "Products":
*   id	nome	    preço
    1	Camiseta	29.99
    2	Calça   	79.99
    3	Tênis	    99.99
    4	Moletom	    59.99
    5	Saia	    39.99

    ? Tabela "Categories":
*   id	nome
    1	Roupas
    2	Calçados
    3	Acessórios
    4	Eletrônicos
    5	Beleza

    ? Tabela "Suppliers":
*   id	nome
    1	Fornecedor A
    2	Fornecedor B
    3	Fornecedor C
    4	Fornecedor D
    5	Fornecedor E

    ? Tabela "ProductSupplier" (RELACIONAL):
*   id	product_id	supplier_id
    1	1	        1
    2	2	        1
    3	2	        2
    4	3	        3
    5	4	        2
    */
})