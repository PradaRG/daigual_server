require("dotenv").config();
const Express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const db = require("./database");
const Producto = require("./modelos/productos.model");
const Proveedor = require("./modelos/proveedor.model");
const Venta = require('./modelos/venta.model');
const Cliente = require('./modelos/cliente.model');
const Caja = require('./modelos/caja.model');
const CuentaCorriente = require('./modelos/cuentacorriente.model');
const Notificacion = require('./modelos/notificacion.model');
const Pedido = require('./modelos/pedido.model');
const Reserva = require('./modelos/reserva.model');
const Usuario = require('./modelos/usuarios.model');

if (process.env.ENVIRONMENT === "dev") {
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

const puerto = process.env.PUERTO || 8080;

servidor.listen(puerto, () => {
  console.log(`servidor corriendo en http:localhost:${puerto}`);
});
