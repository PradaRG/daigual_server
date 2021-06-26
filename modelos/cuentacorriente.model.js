const db = require("../database");
const { DataTypes } = require("sequelize");
const Cliente = require("./cliente.model");
const Venta = require("./productos.model");

const CuentaCorriente = db.define("CuentaCorriente", {
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
  recargo: {// por si quiere agregar un recargo cada tanto
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  pagoEnEfectivo: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

});

CuentaCorriente.belongsTo(Cliente, {
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});
Cliente.hasOne(CuentaCorriente)



module.exports = CuentaCorriente;