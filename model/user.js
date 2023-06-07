const { DataTypes, Op } = require("sequelize")
const sequelize = require("../helpers/db")

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
})

module.exports = {
    list: async function () {
        const users = await UserModel.findAll()
        return users
    },

    save: async function (username) {
        const user = await UserModel.create({
            username: username
        })

        return user
    },

    update: async function (id, username, password) {
        return await UserModel.update(
            { username: username, password: password },
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
    model: UserModel
}