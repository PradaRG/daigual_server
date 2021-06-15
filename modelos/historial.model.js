const db = require("../database");
const { DataTypes } = require("sequelize");
const Stock = require("./stock.model");

const Historial = db.define("Historial", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4(),
      },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0  
        }
    },
});

Stock.hasMany(Historial);
Historial.belongsTo(Stock);


module.exports = Historial;