const Joi = require("joi")

const ProductSchema = Joi.object({
    id: Joi.number()
        .integer()
        .greater(0),
    name: Joi.string()
        .min(2)
        .required()
        .max(20),
    price: Joi.number()
        .required()
        .greater(0),
    qtd: Joi.number()
        .integer()
        .required()
        .greater(-1), //>=0
    supplier: Joi.number()
        .integer()
        .required()
        .greater(0),
    categorie: Joi.number()
        .integer()
        .required()
        .greater(0),
})
const UpSchema = Joi.object({
    id: Joi.number()
        .integer()
        .greater(0),
    name: Joi.string()
        .min(2)
        .required()
        .max(20),
    price: Joi.number()
        .required()
        .greater(0),
    qtd: Joi.number()
        .integer()
        .required()
        .greater(-1), //>=0
})

module.exports = {
    validateProduct: function(req, res,next){
        const {error, value} = ProductSchema.validate(req.body);
        if(error){
            return res.status(400).json({status: false, menssage: "Dados do Produto Imcompletos/Errados", err: error})
        }
        req.body = value
        return next()
    },
    validateUpProduct: function(req, res,next){
        const {error, value} = UpSchema.validate(req.body);
        if(error){
            return res.status(400).json({status: false, menssage: "Dados do Produto Imcompletos/Errados", err: error})
        }
        req.body = value
        return next()
    }
}