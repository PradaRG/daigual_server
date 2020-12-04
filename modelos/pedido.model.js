const db = require("../database");
const { DataTypes } = require("sequelize");
const Proveedor = require("./proveedor.model");
const Producto = require("./productos.model");
//verificar que en un pedido haya varios productos....deberia haber una variable que sea n0 de pedido auto incremental para que se repita?
const Pedido = db.define("Pedido", {
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
  },
});

Pedido.belongsTo(Proveedor, {
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Proveedor.hasMany(Pedido);
Pedido.hasMany(Producto);
Producto.belongsTo(Pedido);

module.exports = Pedido;