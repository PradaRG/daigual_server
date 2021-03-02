const createError = require("http-errors");
const logger = require("../helpers/createLogger");
const { v4 } = require("uuid");

async function defaultRoute(req, res, next) {
  next(createError.NotFound("Direccion no encontrada"));
}

async function errorHandler(err, req, res, next) {
  // Genera un numero aleatorio para identificar el error en los logs
  const randomErrorId = v4();
  await logger.log({
    level: "error",
    errorID: randomErrorId,
    message: err.message,
    error: err,
    body: req.body,
    statusCode: err.status,
  });
  // Si el error proviene de Joi significa que la informacion enviada en la peticion es incorrecta o incompleta
  if (err.isJoi === true) {
    return res.status(400).json({
      error: {
        codigo: randomErrorId,
        message: "La informacion proporcionada es incorrecta o esta incompleta",
      },
    });
  } else if (err instanceof createError.HttpError) {
    // Si el error es de tipo httpError, es un tipo de error esperado y el mensaje puede ser mostrado a los usuarios
    res.status(err.status || 500).json({
      error: {
        codigo: randomErrorId,
        message: err.message,
      },
    });
  } else if (err.name !== "JsonWebTokenError") {
    res.status(401).json({
      error: {
        codigo: randomErrorId,
        message: err.message,
      },
    });
  } else {
    // Si el error llega a esta instancia, es un error inesperado en el servidor y no debe ser revelado al usuario, se le envia el codigo y un mensaje para remitirlo a nosotros
    res.status(500).json({
      error: {
        codigo: randomErrorId,
        message: "Error interno del servidor",
        suggestion:
          "Por favor remita el codigo a los desarrolladores para su analisis",
      },
    });
  }
}

module.exports = { defaultRoute, errorHandler };
