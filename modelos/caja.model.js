const db = require("../database");
const { DataTypes } = require("sequelize");
const Venta = require("../modelos/venta.model");

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
  montoTotalVendido: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
    },
  },
  montoEfectivoInicio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
    },
  },
  montoEfectivoFinal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 1,
    },
  },
}

);

Venta.belongsTo(Caja, {
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});
Caja.hasMany(Venta);

module.exports = Caja;
