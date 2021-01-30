const {DataTypes} = require('sequelize');
const db = require('../database');

const Usuario = db.define('Usuario', {
id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4()
},
nombre: {
    type: DataTypes.STRING,
    allowNull: false
},
password: {
    type: DataTypes.STRING(64),
    allowNull: false,
},
tipoUsuario: {
    type: DataTypes.ENUM('MASTER', 'ADMIN', 'VENDEDOR'),
    allowNull: false
},
ventaRapida: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
}
});

//PERMISOS:
//MASTER: Full + cambiar permisos
//ADMIN: Crear CC, CUD productos, agregar proveedores, CUD pedidos, modificar ventas + permisos de Vendedor
//VENDEDOR Realizar ventas, reporte de cajas

module.exports = Usuario;