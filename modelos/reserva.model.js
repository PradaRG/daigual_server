const db = require("../database");
const { DataTypes } = require("sequelize");
const Cliente = require("./cliente.model");
const Venta = require("./productos.model");
const Producto = require("./productos.model");
const Movimientos = require("./movimientos.model");

// pensar reserva estado de venta si se vendio o no al momento del cierre 
// notificacion  pagado 

const Reserva = db.define("Reserva", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 1,
    },
  },
  estado: {
    type: DataTypes.ENUM(
      "entregado",
      "pendiente",
      "cancelado")
  },
  montoAbonado: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
    },
  },
});

Reserva.belongsTo(Cliente, {
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});
Cliente.hasMany(Reserva)

Reserva.belongsTo(Producto);
Producto.hasOne(Reserva, {
  primaryKey: {
    allowNull: true
  }
});

Reserva.hasMany(Movimientos);
Movimientos.belongsTo(Reserva, {
  primaryKey: {
    allowNull: true
  }
})

module.exports = Reserva;