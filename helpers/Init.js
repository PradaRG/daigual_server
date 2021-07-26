const Producto = require("../modelos/productos.model");
const Proveedor = require("../modelos/proveedor.model");
const Cliente = require("../modelos/cliente.model");
const Rubro = require("../modelos/rubros.model");
const Stock = require("../modelos/stock.model");
const Usuario = require("../modelos/usuarios.model");


const UsuariosIniciales = [{
    nombre: "patricia",
    password: "hEAmageN",
    permisos: "MASTER",
    ventaRapida: 581,
}, {
    nombre: "juanmanuel",
    password: "lURGoesP",
    permisos: "ADMIN",
    ventaRapida: 409,
}];

const ClientesIniciales = [{
    "nombre": "Consumidor final",
    "email": "sinmail@sinmail.com",
    "telefono": "343-1234565",
    "descripcion": ""
}];

async function initDB() {
    try {
        await Usuario.bulkCreate(UsuariosIniciales, {
            individualHooks: true
        });
        await Cliente.bulkCreate(ClientesIniciales);
    } catch (error) {
        console.log(error);
    }
}

module.exports = initDB;