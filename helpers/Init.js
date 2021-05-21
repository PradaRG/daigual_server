const Producto = require("../modelos/productos.model");
const Proveedor = require("../modelos/proveedor.model");
const Rubro = require("../modelos/rubros.model");
const Stock = require("../modelos/stock.model");
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

const productosIniciales = [
    {
        codInterno: 'BL',
        codigoPaquete: '0989809812354',
        ubicacion: "LOCAL",
        nombre: 'Sabanas',
        marca: 'Inducol',
        descripcion: 'Sabanas de 6 hilos',
        alertaMin: '3',
        precioVenta: '1200',
    },
    {
        codInterno: 'B',
        codigoPaquete: '1236152545123',
        ubicacion: "LOCAL",
        nombre: 'Sarten',
        marca: 'Tramontina',
        descripcion: 'Sarten doble fondo',
        alertaMin: '5',
        precioVenta: '850',
    },
    {
        codInterno: 'J',
        codigoPaquete: '1235123512',
        ubicacion: "LOCAL",
        nombre: 'Muñeco de Accion Power Ranger',
        marca: 'Matel',
        descripcion: 'Muñeco articulado, edad recomendada 4+ años',
        alertaMin: '2',
        precioVenta: '2500',
    }
];

const stocksIniciales = [
    {
        cantidad: 12,
        precioCompra: 890
    },
    {
        cantidad: 7,
        precioCompra: 540
    },
    {
        cantidad: 5,
        precioCompra: 1379
    }
];

const UsuariosIniciales = [{
    nombre: "master",
    password: "bigshop",
    permisos: "MASTER",
    ventaRapida: 123,
}, {
    nombre: "admin",
    password: "bigshop",
    permisos: "ADMIN",
    ventaRapida: 234,
}, {
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

        for (let index = 0; index < productosIniciales.length; index++) {
            Producto.create(productosIniciales[index]).then(prod =>{
                Stock.create(stocksIniciales[index]).then(stock => prod.addStocks(stock));
            })
            
        }

        if (rubros && proveedores && usuarios) console.log("Inicializado con exito");
    } catch (error) {
        console.log(error);
    }
}

module.exports = initDB;