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
        console.log('here')
        const users = await UserModel.findAndCountAll({
            attributes:{
                exclude: ['password'],
            },
            offset: limit * (pag - 1),
            limit: limit
        })
        return users // {count, rows}
    },

    save: async function (obj) {
        return await UserModel.create({
            username: obj.username,
            password: obj.password,
        })
    },

    update: async function (username, obj) {
        return await UserModel.update(
            { username: obj.username, password: obj.password },
            { where: { username: username } }
        )
    },

    changePassword: async function (username, password) {
        return await UserModel.update(
            { password: password },
            { where: { username: username } }
        )
    },

    changeUserName: async function (username, username) {
        return await UserModel.update(
            { username: username },
            { where: { username: username } }
        )
    },

    delete: async function (username) {
        return await UserModel.destroy({ where: { username: username } })
    },

    getById: async function (id) {
        return await UserModel.findByPk(id)
    },

    getByUserName: async function (username) {
        return await UserModel.findOne({
            where: {
                username: username
            }
        })
    },

    isRegistered: async function(obj){
        return await UserModel.findOne({
            where: {
                username: obj.username,
                password: obj.password
            }
        })
    },

    isAdmin: async function (username) {
        return (await UserModel.findOne({
            where: {
                username: username,
            }
        })).administrador
    },

    toAdmin: async function (username) {
        return await UserModel.update(
            { administrador: true },
            { where: { username: username } })
    },

    toNotAdmin: async function (username) {
        return await UserModel.update(
            { administrador: false },
            { where: { username: username } })
    },

    model: UserModel
}