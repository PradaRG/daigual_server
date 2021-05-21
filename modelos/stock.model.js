const db = require("../database");
const { DataTypes, Sequelize } = require("sequelize");
const Producto = require("./productos.model");
const { sequelize } = require("./proveedor.model");

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
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fechaAdquisicion: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    }
});

module.exports = Stock;