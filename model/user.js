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
        const user = await AuthorModel.create({
            username: username
        })

        return user
    },

    update: async function (id, username, password) {
        return await AuthorModel.update(
            { username: username, password: password },
            { where: { id: id } }
        )
    },

    delete: async function (id) {
        //Precisa fazer algo para os livros que este autor possui
        return await AuthorModel.destroy({ where: { id: id } })
    },

    getById: async function (id) {
        return await AuthorModel.findByPk(id)
    },

    getByName: async function (username) {
        return await AuthorModel.findOne({
            where: {
                username: {
                    [Op.like]: '%' + username + '%'
                }
            }
        })
    },
    model: UserModel
}