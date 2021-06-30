const db = require("../database");
const { DataTypes, Sequelize } = require("sequelize");
const Producto = require("./productos.model");

const Stock = db.define('Stock', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    precioCompra: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    fechaAdquisicion: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    }
});

module.exports = Stock;