const db = require("../database");
const { DataTypes } = require("sequelize");
const Producto = require("./productos.model");

const Stock = db.define('Stock', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioCompra: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    fechaAdquisicion: {
        type: DataTypes.DATE,
    }
});

Stock.belongsTo(Producto);
Producto.hasMany(Stock);

module.exports = Stock;