/*
    ? Tabela "Supplier":
*   id: int pkey
*   nome: string
*/

const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/db")

const SupplierModel = sequelize.define('Supplier', {
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
})

module.exports = {
    model: SupplierModel
}