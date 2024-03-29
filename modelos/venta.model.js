const db = require("../database");
const { DataTypes } = require("sequelize");
const Cliente = require("./cliente.model");
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
    ), allowNull: false,
  },
  tipoPago: {
    type: DataTypes.ENUM(
      "Efectivo",
      "Tarjeta",
      "Debito",
      "Efectivo + Tarjeta"
    ),
    allowNull: false,
    defaultValue: "Efectivo",
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

Venta.belongsTo(Usuario);
Usuario.hasMany(Venta);

module.exports = Venta;
