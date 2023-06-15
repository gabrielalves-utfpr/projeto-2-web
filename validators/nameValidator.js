const Joi = require("joi")

module.exports = {
    validateName: function(req, res,next){
        const {error, value} = Joi.string().min(2).required().max(20).validate(req.body);
        if(error){
            return res.json({status: false, menssage: "Dados Incompleto/Errado"})
        }
        req.body = value
        return next()
    }
}