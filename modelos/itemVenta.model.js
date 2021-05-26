const db = require("../database");
const { DataTypes } = require("sequelize");
const Venta = require("./venta.model");
const Producto = require("./productos.model");

const ItemVenta = db.define('ItemsVenta', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
    },
    precioCompra: {
        type: DataTypes.FLOAT,
        allowNull: false,
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

ItemVenta.belongsTo(Venta);
Venta.hasMany(ItemVenta);

ItemVenta.belongsTo(Producto);
Producto.hasMany(ItemVenta);


module.exports = ItemVenta;