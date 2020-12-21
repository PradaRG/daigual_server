const Express = require("express");
const router = Express.Router();
const createError = require("http-errors");
const Usuario = require("../modelos/usuarios.model");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const {
  userRegistrationSchema,
  userLoginSchema,
} = require("../helpers/ValidationSchema");
const logger = require("../helpers/createLogger");

// Manejo de las rutas de usuarios

router.post("/register", async (req, res, next) => {
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
        user: createdUser,
      });

      res.sendStatus(201);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await userLoginSchema.validateAsync(req.body);

    const user = await Usuario.findOne({ where: { nombre: result.nombre } });

    if (!user) throw createError.NotFound("Usuario no registrado");

    const isMatch = await user.comparePassword(result.password);

    if (!isMatch)
      throw createError.Unauthorized("Nombre/Contraseña incorrecta");

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res.status(200).json({ accessToken, refreshToken });
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
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.status(200).json({ accessToken: accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
