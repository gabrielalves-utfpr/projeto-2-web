const Joi = require("joi")

module.exports = {
    validateName: function(req, res,next){
        const {error, value} = Joi.string().min(2).required().max(20).validate(req.body.name);
        if(error){
            return res.status(400).json({status: false, menssage: "Dados Incompleto/Errado"})
        }
        return next()
    }
}