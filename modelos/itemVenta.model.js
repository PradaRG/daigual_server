const db = require("../database");
const { DataTypes } = require("sequelize");
const Venta = require("./venta.model");
const Producto = require("./productos.model");
const Stock = require("./stock.model");

const ItemVenta = db.define('ItemsVenta', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
    },
    precioVenta: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

ItemVenta.belongsTo(Venta);
Venta.hasMany(ItemVenta);

ItemVenta.hasOne(Stock, {
    foreignKey: {
        name: 'productosVendidos'
    }
});
Stock.belongsTo(ItemVenta)

ItemVenta.belongsTo(Producto);
Producto.hasMany(ItemVenta);


module.exports = ItemVenta;