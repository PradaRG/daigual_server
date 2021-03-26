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
    validate: {
      isFloat: true,
      min: 1,
    },
  },
  tipoPago: {
    type: DataTypes.ENUM(
      "Efectivo",
      "Tarjeta",
      "Debito",
      "Cuenta Corriente",
      "Reserva"
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
  pagoEnEfectivo: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

Venta.belongsTo(Cliente, {
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});
Cliente.hasMany(Venta);
//Venta.hasMany(Producto);
Producto.belongsToMany(Venta, {through: 'VentasDeProductos'});
Venta.hasOne(Usuario)
//Usuario.hasMany(Venta)



module.exports = Venta;
