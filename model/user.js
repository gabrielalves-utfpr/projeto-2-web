const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/db")

/*
    ? Tabela "Users":
*   id: int pkey
*   username: string
*   senha: string
*   administrador: bool
*/

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    administrador: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
})

module.exports = {
    list: async function () {
        const users = await UserModel.findAll()
        return users
    },
    listByPage: async function (limit, pag) {
        const users = await UserModel.findAndCountAll({
            offset: limit * (pag - 1),
            limit: limit
        })
        return users // {count | rows}
    },

    save: async function (obj) {
        const user = await UserModel.create({
            username: obj.username,
            password: obj.password
        })

        return user
    },

    update: async function (id, obj) {
        return await UserModel.update(
            { username: obj.username, password: obj.password },
            { where: { id: id } }
        )
    },

    changePassword: async function (id, password) {
        return await UserModel.update(
            { password: password },
            { where: { id: id } }
        )
    },

    changeUserName: async function (id, username) {
        return await UserModel.update(
            { username: username },
            { where: { id: id } }
        )
    },

    delete: async function (id) {
        return await UserModel.destroy({ where: { id: id } })
    },

    getById: async function (id) {
        return await UserModel.findByPk(id)
    },

    getByName: async function (username) {
        return await UserModel.findOne({
            where: {
                username: username
                // Username has to be the exact
                // so no { [Op.like]: '%' + username + '%' }
            }
        })
    },

    isAdmin: function (obj) {
        if (obj.administrador == true) {
            return true
        } else {
            return false
        }
    },

    toAdmin: async function (id) {
        return await UserModel.update(
            { administrador: true },
            { where: { id: id } })
    },

    toNotAdmin: async function (id) {
        return await UserModel.update(
            { administrador: false },
            { where: { id: id } })
    },

    model: UserModel
}