const db = require("../database");
const { DataTypes } = require("sequelize");
const Proveedor = require("./proveedor.model");
const Stock = require("./stock.model");

const Producto = db.define("Producto", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
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
  marca: {
    type: DataTypes.STRING(50),
    allowNull: true,
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
    }
  },
  precioVenta: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  }
});

Producto.hasMany(Stock);
Stock.belongsTo(Producto);

Producto.belongsTo(Proveedor,
  {
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  }
);
Proveedor.hasMany(Producto);

module.exports = Producto;