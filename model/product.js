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
    model: SupplierModel
}