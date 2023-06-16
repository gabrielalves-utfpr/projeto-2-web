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