const db = require("../database");
const { DataTypes } = require("sequelize");
const Venta = require("./venta.model");
const Producto = require("./productos.model");

const ItemsVenta = db.define('ItemsVenta', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
      },
      precioVenta: {
          type: DataTypes.FLOAT,
          allowNull: false,  
      },
      cantidad: {
          type: DataTypes.INTEGER,
          allowNull: false
      }
});

ItemsVenta.belongsTo(Venta);
Venta.hasMany(ItemsVenta);

ItemsVenta.hasMany(Producto);
Producto.hasMany(ItemsVenta, {
    constraints: false
});


module.exports = ItemsVenta;