const db = require("../database");
const { DataTypes } = require("sequelize");
const Venta = require("./Venta.model");

const Caja = db.define("Caja", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  estado: {
    type: DataTypes.ENUM("ABIERTA", "CERRADA", "PENDIENTE"),
    allowNull: false,
},
//EL TOTAL DE LA CAJA CONTADA
monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 1,
    },},
});

Venta.belongsTo(Caja, {
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Caja.hasMany(Venta);

module.exports = Venta;
