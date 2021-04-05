const db = require("../database");
const { DataTypes } = require("sequelize");
const Producto = require("./productos.model");

const Rubro = db.define("Rubro", {
rubro: {
    type: DataTypes.STRING,
    primaryKey: true
}}, {
    paranoid: false
});

Rubro.hasMany(Producto);
Producto.belongsTo(Rubro);

module.exports = Rubro;