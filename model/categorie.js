/*
    ? Tabela "Categorie":
*   id: int pkey
*   nome: string
*/

const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/db")

const CategorieModel = sequelize.define('Categorie', {
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
    model: CategorieModel
}