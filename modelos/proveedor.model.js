  const db = require("../database");
const { DataTypes } = require("sequelize");


const Proveedor = db.define("Proveedor", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
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



module.exports = Proveedor;
