const db = require("../database");
const { DataTypes } = require("sequelize");
const Producto = require("./producto.model");



module.exports = function(sequelize, DataTypes) {
    var producto = sequelize.define("producto", {
    // poner todo los atributos

    }, {
    
    associate: function(models) {
    // associaciones_?
    producto.hasOne(models.Config)
    },
    hooks: {
    /*a esto no lo esta llamando*/
    afterCreate: function(producto,option){
        models.Config.create({
            productoid: producto.id
        })
    }
  }
});
return producto;
};
