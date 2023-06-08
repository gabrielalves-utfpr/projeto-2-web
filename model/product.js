/*
    ? Tabela "Product":
*   id: int pkey
*   nome: string
*   price: int
*/

const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/db")
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
    qtd: { //quantidade
        type: DataTypes.INTEGER,
        allowNull: false,
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

    save: async function (obj) {
        const product = await ProductModel.create({
            name: obj.name,
            qtd: obj.qtd,
            price: obj.price
        })

        return product
    },

    update: async function (id, obj) {
        return await ProductModel.update(
            { name: obj.name, qtd: obj.qtd, price: obj.price },
            { where: { id: id } }
        )
    },

    changeName: async function (id, name) {
        return await ProductModel.update(
            { name: name },
            { where: { id: id } }
        )
    },

    changePrice: async function (id, price) {
        return await ProductModel.update(
            { price: price },
            { where: { id: id } }
        )
    },
    addRemoveQtd: async function (id, qtd) { // qtd + add; qtd - remove
        return await ProductModel.update(
            { qtd: ProductModel.findByPk(id).qtd + qtd },
            { where: { id: id } }
        )
    },

    buy: async function (id) {
        return await ProductModel.update(
            { qtd: ProductModel.findByPk(id).qtd - 1 },
            { where: { id: id } }
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