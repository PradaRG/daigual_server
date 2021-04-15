// Esta libreria vuelca los errores a un archivo en vez de a la consola cuando NODE_ENV esta seteado en 'production'
const winston = require("winston");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "info.log", level: "info" }),
    new winston.transports.Console()
  ],
});

if (process.env.NODE_ENV !== "tito") { //TODO: Cambiar el valor de node env
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
