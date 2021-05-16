require("dotenv").config();
const Express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require("./handlers/User.route");
const productRouter = require("./handlers/Producto.route");
const proveedorRouter = require("./handlers/Proveedor.route");
const rubroRouter = require("./handlers/Rubro.route");
const cajaRouter = require('./handlers/Caja.route');
const { defaultRoute, errorHandler } = require("./handlers/ErrorHandlers");
const db = require("./database");



const Producto = require("./modelos/productos.model");
const Stock = require("./modelos/stock.model");
const ItemsVenta = require("./modelos/itemVenta.model");
const Proveedor = require("./modelos/proveedor.model");
const Venta = require('./modelos/venta.model');
const Cliente = require('./modelos/cliente.model');
const Caja = require('./modelos/caja.model');
const CuentaCorriente = require('./modelos/cuentacorriente.model');
const Notificacion = require('./modelos/notificacion.model');
const Pedido = require('./modelos/pedido.model');
const Reserva = require('./modelos/reserva.model');
const Usuario = require('./modelos/usuarios.model');
const Rubro = require('./modelos/rubros.model');

const { verifyAccessToken } = require('./helpers/jwt_helper');

const initDB = require("./helpers/Init");

if (process.env.NODE_ENV === "dev") {
  db.sync({ force: true }).then(() => initDB());
}

// console.log(require('crypto').randomBytes(64).toString('base64'));
// console.log(require('crypto').randomBytes(64).toString('base64'));

const servidor = Express();

//Middlewares
servidor.use(helmet());
servidor.use(morgan("short"));
servidor.use(Express.json());
servidor.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
servidor.use(cookieParser());

// Routers
servidor.use("/usuarios", userRouter);
servidor.use('/proveedores', proveedorRouter);
servidor.use('/productos', productRouter);
servidor.use('/rubros', rubroRouter);
servidor.use('/caja', cajaRouter);
servidor.use(defaultRoute);
servidor.use(errorHandler);

const puerto = process.env.PUERTO || 8080;

servidor.listen(puerto, () => {
  console.log(`servidor corriendo en http://localhost:${puerto}`);
});
