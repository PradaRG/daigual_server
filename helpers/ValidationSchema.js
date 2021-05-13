const Joi = require("joi");

const userRegistrationSchema = Joi.object({
  nombre: Joi.string().required().min(5),
  password: Joi.string().required().min(5),
  permisos: Joi.string().valid("MASTER", "ADMIN", "VENDEDOR").required(),
  ventaRapida: Joi.number().positive().min(000).max(999),
});

const userLoginSchema = Joi.object({
  nombre: Joi.string().required().min(5),
  password: Joi.string().required().min(5),
});

const ProductoValidationSchema = Joi.object({
  codInterno: Joi.string().length(14),
  codigoPaquete: Joi.string().length(14),
  ubicacion: Joi.string().valid("PROVEEDOR", "DEPOSITO", "LOCAL"),
  nombre: Joi.string().max(50),
  marca: Joi.string().max(50),
  descripcion: Joi.string(),
  alertaMin: Joi.number().positive().min(1),
  alertaMax: Joi.number().positive().min(1),
  cantidad: Joi.number().positive().min(1),
  precio: Joi.number().min(1)
});



module.exports = {
  userRegistrationSchema,
  userLoginSchema,
};
