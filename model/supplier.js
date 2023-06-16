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
    list: async function () {
        const suppliers = await SupplierModel.findAll()
        return suppliers
    },
    listByPage: async function (limit, pag) {
        const supplier = await SupplierModel.findAndCountAll({
            offset: limit * (pag - 1),
            limit: limit
        })
        return supplier // {count | rows}
    },

    save: async function (name) {
        const supplier = await SupplierModel.create({
            name: name,
        })

        return supplier
    },

    update: async function (id, name) {
        return await SupplierModel.update(
            { name: name },
            { where: { id: id } }
        )
    },

    delete: async function (id) {
        return await SupplierModel.destroy({ where: { id: id } })
    },

    getById: async function (id) {
        return await SupplierModel.findByPk(id)
    },

    getByName: async function (name) {
        return await SupplierModel.findOne({
            where: {
                name: name
            }
        })
    },
    model: SupplierModel
}