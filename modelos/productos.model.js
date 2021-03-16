const db = require("../database");
const { DataTypes } = require("sequelize");
const Proveedor = require("./proveedor.model");

const Producto = db.define("Producto", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  codInterno: {
    type: DataTypes.STRING(25),
    allowNull: true,
    unique: true
  },
  codigoPaquete: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  ubicacion: {
    type: DataTypes.ENUM("PROVEEDOR", "DEPOSITO", "LOCAL"),
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  alertaMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  precioVenta: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

//faltan foreing key de provedor y pedido
Producto.belongsTo(Proveedor,
  {
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  }
);
Proveedor.hasMany(Producto);

module.exports = Producto;