const db = require("../database");
const { DataTypes } = require("sequelize");
const Usuario = require("./usuarios.model");

const Notificacion = db.define("Notificacion", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4(),
  },
  asunto : {
    type: DataTypes.STRING(200),
    allowNull: true,
  },

    mensaje: {
      type: DataTypes.STRING(600),
      allowNull: true,
    },
    leido: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    
  },}
);

//agregar foreing key  producto
Notificacion.belongsTo(Usuario,
  {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  }
);
Usuario.hasMany(Notificacion);

module.exports = Notificacion;