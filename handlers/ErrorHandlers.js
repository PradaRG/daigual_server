const createError = require("http-errors");
const logger = require("../helpers/createLogger");
const { v4 } = require("uuid");

async function defaultRoute(req, res, next) {
  next(createError.NotFound("Not found"));
}

async function errorHandler(err, req, res, next) {
  const randomErrorId = v4();

  const mensaje = err.message || "Hola tito";
  await logger.log({
      level: 'error',
      errorID: randomErrorId,
      message: mensaje,
      statusCode: err.status,
  });

  res.status(err.status || 500).json({
    error: {
      codigo: randomErrorId,
      message:
        "Hubo un problema, por favor remita el codigo a los desarrolladores para su analisis",
    },
  });
}

module.exports = { defaultRoute, errorHandler };
