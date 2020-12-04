const db = require("../database");
const { DataTypes } = require("sequelize");

const Producto = db.define("Producto", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  codigoInterno: {
    type: DataTypes.STRING(25),
    allowNull: true,
  },
  codigoPaquete: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  ubicacion: {
    type: DataTypes.ENUM("PROVEEDOR", "DEPOSITO", "LOCAL"),
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  alertaMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  alertaMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  estado: {
      type: DataTypes.ENUM("BUENO", "DEFECTUOSO", "RESERVADO"),
      allowNull: false,
  },

  
});

//faltan foreing key de provedor y pedido
//Producto.belongsTo(proveedor)

module.exports = Producto;