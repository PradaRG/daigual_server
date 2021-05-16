const { DataTypes } = require("sequelize");
const db = require("../database");
const bcrypt = require("bcrypt");

const Usuario = db.define(
  "Usuario",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4(),
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    permisos: {
      type: DataTypes.ENUM("MASTER", "ADMIN", "VENDEDOR"),
      allowNull: false,
    },
    ventaRapida: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
      }
    },
  }
);

Usuario.prototype.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

//PERMISOS:
//MASTER: Full + cambiar permisos
//ADMIN: Crear CC, CUD productos, agregar proveedores, CUD pedidos, modificar ventas + permisos de Vendedor
//VENDEDOR Realizar ventas, reporte de cajas

module.exports = Usuario;
