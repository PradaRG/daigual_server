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
    type: DataTypes.ENUM("ABIERTA", "CERRADA"),
    allowNull: false,
},

turno: {
  type: DataTypes.ENUM("MAÑANA", "TARDE"),
  allowNull: false,
},

//EL TOTAL DE LA CAJA CONTADA
MontoTotalVendido: {
  type: DataTypes.FLOAT,
  allowNull: false,
  validate: {
    isFloat: true,
    min: 1,
  },},
MontoEfectivoInicio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 1,
    },},
MontoEfectivoFinal: { 
  type: DataTypes.FLOAT,
   allowNull: false,
   validate: {
      isFloat: true,
      min: 1,
      },},
}

);

Venta.belongsTo(Caja, {
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Caja.hasMany(Venta);

module.exports = Venta;
