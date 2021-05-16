const Proveedor = require("../modelos/proveedor.model");
const Rubro = require("../modelos/rubros.model");
const Usuario = require("../modelos/usuarios.model");

const RubrosIniciales = [
    { "rubro": 'Acero' },
    { "rubro": 'Marroquineria' },
    { "rubro": 'Lenceria' },
    { "rubro": 'Bazar' },
    { "rubro": 'Juguete' },
    { "rubro": 'Libreria' },
    { "rubro": 'Peluches' },
    { "rubro": 'Regaleria' },
    { "rubro": 'Santeria' },
    { "rubro": 'Otros' },
    { "rubro": 'Ferreteria' }
];

const ProveedoresIniciales = [{
    "codigoInterno": "es",
    "nombre": "El sembrador SRL",
    "email": "elsembrador@yahoo.com",
    "telefono": "343-1234565",
    "descripcion": "Mayorista de bebidas con y sin alcohol"
},
{
    "codigoInterno": "slp",
    "nombre": "Selplast",
    "email": "selplast@google.net",
    "telefono": "343-1132485",
    "descripcion": "Mayorista de articulos de libreria"
}, {
    "codigoInterno": "mnt",
    "nombre": "Montagne",
    "email": "montagne@montagne.com.ar",
    "telefono": "343-121234765",
    "descripcion": "Proveedor de articulos de camping, caza y pesca"
}];

const UsuariosIniciales = [{
    nombre: "master",
    password: "bigshop",
    permisos: "MASTER",
    ventaRapida: 123,
  },{
    nombre: "admin",
    password: "bigshop",
    permisos: "ADMIN",
    ventaRapida: 234,
  },{
    nombre: "vendedor",
    password: "bigshop",
    permisos: "VENDEDOR",
    ventaRapida: 345,
  }];


async function initDB() {
    try {
        const rubros = await Rubro.bulkCreate(RubrosIniciales);
        const proveedores = await Proveedor.bulkCreate(ProveedoresIniciales);
        const usuarios = await Usuario.bulkCreate(UsuariosIniciales, {
            individualHooks: true
        });
        if(rubros && proveedores && usuarios) console.log("Inicializado con exito");
    } catch (error) {
        console.log(error);
    }
}

module.exports = initDB;