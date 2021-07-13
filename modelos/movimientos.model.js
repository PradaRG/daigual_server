const db = require("../database");
const { DataTypes } = require("sequelize");
const Caja = require('../modelos/caja.model');
const Usuario = require("./usuarios.model");

const Movimientos = db.define('Movimientos', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
    },
    descripcion: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    operacion: {
        type: DataTypes.ENUM("deposito", "extraccion")
    },
    monto: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isFloat: true,
            min: 0,
        },
    },
    estado: {
        type: DataTypes.ENUM(
            "finalizada",
            "cancelada",
        ),
        allowNull: false,
        defaultValue: "finalizada"
    }
})

Movimientos.hasOne(Usuario);
Usuario.hasMany(Movimientos);
Caja.hasMany(Movimientos);
Movimientos.belongsTo(Caja, {
    primaryKey: {
        allowNull: false
    }
});

module.exports = Movimientos;