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

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
};
