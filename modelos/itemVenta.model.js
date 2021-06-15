const db = require("../database");
const { DataTypes } = require("sequelize");
const Venta = require("./venta.model");
const Producto = require("./productos.model");
const Historial = require("./historial.model");

const ItemVenta = db.define('ItemsVenta', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
    },
    cantidad: {
        type: DataTypes.INTEGER
    },
    precioVenta: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    VentaId:{
        type: DataTypes.UUID,
        references: {
            model: Venta,
            key: 'id'
    }
    }
}, {
    name: {
        singular: "ItemVenta",
        plural: 'ItemsVenta'
    },
    
});

ItemVenta.belongsTo(Venta);
Venta.hasMany(ItemVenta);

ItemVenta.hasMany(Historial);
Historial.belongsTo(ItemVenta);

ItemVenta.belongsTo(Producto);
Producto.hasMany(ItemVenta);


module.exports = ItemVenta;