const db = require("../database");
const { DataTypes } = require("sequelize");
const Cliente = require("./cliente.model");
const Venta = require("./productos.model");

const Reserva = db.define("Reserva", {
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
  
  descuento: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  recargo: {// porsi quiere agregar un recargo cada tanto
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  pagoEnEfectivo: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

});

Reserva.belongsTo(Cliente, {
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Cliente.hasMany(Reserva)
Reserva.hasOne(Venta);
Venta.belongsTo(Reserva);

module.exports = Reserva;