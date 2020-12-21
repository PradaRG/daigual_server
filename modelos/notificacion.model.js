const db = require("../database");
const { DataTypes } = require("sequelize");
const Proveedor = require("./proveedor.model");
const Producto = require("./productos.model");

const Notificacion = db.define("Notificacion", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },

  cantidad:{// esta no es necesaria pero bueno es mejor que sobre
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
    // NECESITA UNA DESCRIPCION
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
});

//agregar foreing key  producto

module.exports = Notificacion;