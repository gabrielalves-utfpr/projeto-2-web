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
    list: async function () {
        const categorie = await CategorieModel.findAll()
        return categorie
    },
    listByPage: async function (limit, pag) {
        const product = await CategorieModel.findAndCountAll({
            offset: limit * (pag - 1),
            limit: limit
        })
        return product // {count | rows}
    },

    save: async function (name) {
        const supplier = await CategorieModel.create({
            name: name,
        })

        return supplier
    },

    update: async function (id, name) {
        return await CategorieModel.update(
            { name: name },
            { where: { id: id } }
        )
    },

    delete: async function (id) {
        return await CategorieModel.destroy({ where: { id: id } })
    },

    getById: async function (id) {
        return await CategorieModel.findByPk(id)
    },

    getByName: async function (name) {
        return await CategorieModel.findOne({
            where: {
                name: name
            }
        })
    },
    model: CategorieModel
}