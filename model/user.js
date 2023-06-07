const { DataTypes, Op } = require("sequelize")
const sequelize = require("../helpers/db")

/*
    ? Tabela "Users":
*   id: int pkey
*   nome: string
*   senha: string
*   administrador: bool
*/

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    administrador: DataTypes.BOOLEAN
})

module.exports = {
    list: async function () {
        const users = await UserModel.findAll()
        return users
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
        //Precisa fazer algo para os livros que este autor possui
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
                //{ [Op.like]: '%' + username + '%' }
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

    model: UserModel
}