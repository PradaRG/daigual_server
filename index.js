require("dotenv").config();
const Express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { defaultRoute, errorHandler } = require("./handlers/ErrorHandlers");

const db = require("./database");
const Producto = require("./modelos/productos.model");
const Proveedor = require("./modelos/proveedor.model");
const Venta = require("./modelos/venta.model");
const { defaultMeta } = require("./helpers/createLogger");

if (process.env.NODE_ENV === "dev") {
  db.sync({ force: true });
}

const servidor = Express();

servidor.use(helmet());
servidor.use(morgan("dev"));
servidor.use(Express.json());

servidor.get("/", async (req, res) => {
  const { mensaje } = req.body;
  console.log(mensaje);
  res.sendStatus(200);
});

servidor.use(defaultRoute);
servidor.use(errorHandler);

const puerto = process.env.PUERTO || 8080;

servidor.listen(puerto, () => {
  console.log(`servidor corriendo en http://localhost:${puerto}`);
});
