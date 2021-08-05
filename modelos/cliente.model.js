const db = require("../database");
const { DataTypes } = require("sequelize");

const Cliente = db.define("Cliente", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  cuil: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        msg: "Numero de telefono invalido",
        args: [5, 30],
      },
    },
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
});

module.exports = Cliente;
