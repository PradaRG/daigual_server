const Joi = require("joi");

const userRegistrationSchema = Joi.object({
  nombre: Joi.string().required().min(5),
  password: Joi.string().required().min(5),
  tipoUsuario: Joi.string().valid("MASTER", "ADMIN", "VENDEDOR"),
  ventaRapida: Joi.number().positive().min(000).max(999),
});

module.exports = {
  userRegistrationSchema,
};
