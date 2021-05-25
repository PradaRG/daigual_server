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
    defaultValue: 1,
    validate: {
      isFloat: true,
      min: 1,
    },
  },
  EstadoVenta: {
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
Venta.belongsTo(Cliente);
Venta.belongsTo(Usuario);
Usuario.hasMany(Venta, { foreignKey: "ventaRapida" })



module.exports = Venta;
