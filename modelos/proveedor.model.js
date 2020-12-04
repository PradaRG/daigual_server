const db = require("../database");
const { DataTypes } = require("sequelize");
const Producto = require("./productos.model");

const Proveedor = db.define("Proveedor", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  codigoInterno: {
    type: DataTypes.STRING(25),
    allowNull: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isEmail: true,
    },
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

Proveedor.hasMany(Producto);
Producto.belongsTo(Proveedor);

module.exports = Proveedor;
