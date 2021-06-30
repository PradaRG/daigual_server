const Express = require("express");
const router = Express.Router();
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const Usuario = require("../modelos/usuarios.model");
const { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } = require("../helpers/jwt_helper");
const { userRegistrationSchema, userLoginSchema } = require("../helpers/ValidationSchema");
const logger = require("../helpers/createLogger");
const cliente = require("../helpers/init_redis");

// Manejo de las rutas de usuarios

router.post("/register", async (req, res, next) => {
  try {
    const result = await userRegistrationSchema.validateAsync(req.body);
    console.log(result);
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
        permisos: result.permisos,
        ventaRapida: result.ventaRapida,
      });
      logger.log({
        level: "info",
        user: createdUser,
        message: "user Created"
      });

      res.sendStatus(201);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/ventaRapida", async (req, res, next)=> {
  try {
    const ventasRapidas = await Usuario.findAll({
      attributes: ['ventaRapida', 'nombre', 'id']
    })
    res.status(200).json(ventasRapidas);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await userLoginSchema.validateAsync(req.body);
    const user = await Usuario.findOne({ where: { nombre: result.nombre } });

    if (!user) throw createError.NotFound("Usuario no registrado");

    const isMatch = await bcrypt.compare(result.password, user.password);

    if (!isMatch) {
      throw createError.Unauthorized("Nombre/Contraseña incorrecta");
    }
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    logger.log({
      level: "info",
      user: user,
      message: "Ingreso al sistema"
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1 * 30 * 24 * 60 * 60 * 1000,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

router.get("/getuser", verifyAccessToken, async (req, res, next) => {
  try {
    const { aud } = req.payload;
    if (!aud) createError.Unauthorized('Token invalido');
    const user = await Usuario.findByPk(aud);
    if (!user) createError.NotFound('Usuario no encontrado para el token');
    if (user) res.status(200).json({ nombre: user.nombre, permisos: user.permisos });
  } catch (error) {
    console.log(error);
    next(error);
  }
});



router.get("/getall", verifyAccessToken, async (req, res, next) => {
  try {
    const { aud } = req.payload;
    if (!aud) createError.Unauthorized('Token invalido');
    const user = await Usuario.findByPk(aud);
    if (!user) createError.NotFound('Usuario no encontrado para el token');
    if (user.permisos !== "MASTER") createError.Unauthorized('Permisos Insuficientes');
    const allUsers = await Usuario.findAll({
      attributes: ['id', 'nombre', 'permisos', 'ventaRapida']
    });
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.put('/reset-user-password', verifyAccessToken, async (req, res, next) => {
  try {
    const { aud } = req.payload;
    const { userId } = req.body;
    if (!aud) createError.Unauthorized('Token invalido');
    const user = await Usuario.findByPk(aud);
    if (!user) createError.NotFound('Usuario no encontrado para el token');
    if (user.permisos !== "MASTER") createError.Unauthorized('Permisos Insuficientes');

    const newUser = await Usuario.findByPk(userId);

    await user.update({ password: 'bigshop' });

    res.sendStatus(200);

  } catch (error) {
    next(error);
  }
});

router.delete('/delete-user', verifyAccessToken, async (req, res, next) => {
  try {
    const { aud } = req.payload;
    const { userId } = req.body;
    console.log("user id", userId);
    console.log("body", req.body);
    if (!aud) createError.Unauthorized('Token invalido');
    const user = await Usuario.findByPk(aud);
    if (!user) createError.NotFound('Usuario no encontrado para el token');
    if (user.permisos !== "MASTER") createError.Unauthorized('Permisos Insuficientes');
    const userBorrar = await Usuario.findByPk(userId);
    console.log("userborrar", userBorrar);
    await userBorrar.destroy();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
);

router.put('/change-password', verifyAccessToken, async (req, res, next) => {
  try {
    const { aud } = req.payload;
    const { password, newPassword } = req.body;
    if (!aud) createError.Unauthorized('Token invalido');

    const user = await Usuario.findByPk(aud);
    if (!user) createError.NotFound('Usuario no encontrado para el token');

    const isMatch = await user.comparePassword(password);

    if (!isMatch) throw createError.Unauthorized("Nombre/Contraseña incorrecta");

    await user.update({ password: newPassword });

    res.sendStatus(200);

  } catch (error) {
    next(error);
  }
});


router.delete("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw createError.BadRequest('No se encontro un token de refresco');
    const userId = await verifyRefreshToken(refreshToken);
    cliente.DEL(userId, (err, value) => {
      if (err) {
        throw createError.InternalServerError('Hubo un problema con Redis');
      }

      logger.log({ level: "info", user: userId, message: "Salio del sistema" });
      res.clearCookie('refreshToken').sendStatus(204);
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw createError.Unauthorized('No se encontro un token de refresco');
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.cookie('refreshToken', refToken, {
      httpOnly: true,
      maxAge: 1 * 30 * 24 * 60 * 60 * 1000,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
