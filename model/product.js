/*
    ? Tabela "Product":
*   id: int pkey
*   nome: string
*   price: int
*/

const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/db")
const supplier = require("./supplier")
const SupplierModel = require('./supplier').model
const CategorieModel = require('./categorie').model

const ProductModel = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    qtd: { // quantidade
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },

})

ProductModel.belongsTo(SupplierModel, {
    foreignKey: 'supplier'
})
SupplierModel.hasMany(ProductModel, { foreignKey: 'supplier' })

ProductModel.belongsTo(CategorieModel, {
    foreignKey: 'categorie'
})
CategorieModel.hasMany(ProductModel, { foreignKey: 'categorie' })

module.exports = {
    list: async function () {
        const products = await ProductModel.findAll()
        return products
    },
    listByPage: async function (limit, pag) {
        const product = await ProductModel.findAndCountAll({
            offset: limit * (pag - 1),
            limit: limit
        })
        return product // {count | rows}
    },

    saveObj: async function (obj) {
        const product = await ProductModel.create({
            name: obj.name,
            price: obj.price,
            supplier: obj.supplier,
            categorie: obj.categorie
        })

        return product
    },

    save: async function (name, price, supplier, categorie) {
        const product = await ProductModel.create({
            name: name,
            price: price,
            supplier: supplier,
            categorie: categorie
        })

        return product
    },

    update: async function (id, obj) {
        return await ProductModel.update(
            { name: obj.name, price: obj.price },
            { where: { id: id } }
        )
    },

    buy: async function (obj){ //obj = {name,qtd}
        if(obj.qtd == null){
            obj.qtd = 1
        }
        ProductModel.findOne({
            where: {
                name: obj.name
            }
        }).then((prod) => {
            if(prod.qtd >= obj.qtd){
                ProductModel.update(
                    { qtd: (prod.qtd - obj.qtd) },
                    { where: { name: obj.name } }
                ).then(user =>{
                    res.status(200).json({status: true, msg: "Produto Comprado"})
                }).catch((err) => {
                    res.status(400).json({status: false, msg: "Não foi possível achar comprar o Produto"})
                });
            }else{
                res.status(410).json({status: false, msg: "Quantidade do Produto no estoque insuficiente. Temos disponíveis:"+prod.qtd})
            }
        }).catch((err) => {
            res.status(401).json({status: false, msg: "Não foi possível achar o produto"})
        });
    },

    sumQdt: async function (name){

    },

    changeName: async function (name, newname) {
        return await ProductModel.update(
            { newname: newname },
            { where: { name: name } }
        )
    },

    changePrice: async function (name, price) {
        return await ProductModel.update(
            { price: price },
            { where: { name: name } }
        )
    },

    delete: async function (id) {
        return await ProductModel.destroy({ where: { id: id } })
    },

    getById: async function (id) {
        return await ProductModel.findByPk(id)
    },

    getByName: async function (name) {
        return await ProductModel.findOne({
            where: {
                name: name
            }
        })
    },
    model: SupplierModel
}