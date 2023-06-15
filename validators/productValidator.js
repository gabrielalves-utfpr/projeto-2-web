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
        .integer()
        .required()
        .greater(0),
    supplier: Joi.number()
        .integer()
        .required()
        .greater(0),
    categorie: Joi.number()
        .integer()
        .required()
        .greater(0),
}).with('id', 'name', 'price', 'supplier', 'categorie')

module.exports = {
    validateProduct: function(req, res,next){
        const {error, value} = ProductSchema.validate(req.body);
        if(error){
            return res.json({status: false, menssage: "Dados do Produto Imcompletos/Errados"})
        }
        req.body = value
        return next()
    }
}