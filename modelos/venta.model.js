const db = require("../database");
const { DataTypes } = require("sequelize");
const Cliente = require("./cliente.model");
const Producto = require("./productos.model");
const Usuario = require("./usuarios.model")

const Venta = db.define("Venta", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isFloat: true,
      min: 0,
    },
  },
  montoTarjeta: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isFloat: true,
      min: 0,
    },
  },
  estadoVenta: {
    type: DataTypes.ENUM(
      "finalizada",
      "cancelada",
      "abierta",
      "retirarEfectivo",
      "agregarEfectivo"
    ), allowNull: false,
    defaultValue: "abierta",
  },
  tipoPago: {
    type: DataTypes.ENUM(
      "efectivo",
      "credito",
      "debito",
      "cuenta corriente",
      "Efectivo + Tarjeta"
    ),
    allowNull: false,
    defaultValue: "efectivo",
  },
  descuento: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  recargo: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  name: {
    singular: "Venta",
    plural: "Ventas"
}
});

Venta.belongsTo(Cliente, {
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});
Cliente.hasMany(Venta);
Usuario.hasMany(Venta);
Venta.belongsTo(Usuario, { foreignKey: "ventaRapida" });



module.exports = Venta;
