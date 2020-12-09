const Express = require("express");
const createError = require("http-errors");
const router = Express.Router();
const Usuario = require("../modelos/usuarios.model");
const { userRegistrationSchema } = require("../helpers/ValidationSchema");
const logger = require("../helpers/createLogger");

// Manejo de las rutas de usuarios

router.post("/register", async(req, res, next) => {
  try {
    const result = await userRegistrationSchema.validateAsync(req.body);

    const user = await Usuario.findOne({
      where: {
        nombre: result.nombre,
      },
    });

    if (user) throw createError.Conflict(`${result.nombre} Ya existe!`);
    else {
      const createdUser = await Usuario.create({
        nombre: result.nombre,
        password: result.password,
        tipoUsuario: result.tipoUsuario,
        ventaRapida: result.ventaRapida,
      });
      logger.log({
        level: "info",
        user: createdUser
      });
      res.sendStatus(201);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

module.exports = router;
