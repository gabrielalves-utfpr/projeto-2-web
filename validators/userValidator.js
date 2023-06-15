const Joi = require("joi")

const UserSchema = Joi.object({
    id: Joi.number()
        .integer()
        .greater(0),
    username: Joi.string()
        .min(2)
        .required()
        .max(20),
    password: Joi.string()
        .min(2)
        .required()
        .max(20),
    administrador: Joi.boolean(),
}).with('id', 'username', 'password', 'administrador')

module.exports = {
    validateUser: function(req, res,next){
        const {error, value} = UserSchema.validate(req.body);
        if(error){
            return res.json({status: false, menssage: "User/Password Imcompletos/Errados"})
        }
        req.body = value
        return next()
    }
}