const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');
const Producto = require('../modelos/productos.model');
const Stock = require("../modelos/stock.model");
const Usuario = require('../modelos/usuarios.model');
const validate = require('../helpers/jwt_helper');
const { Op, INTEGER } = require('sequelize');
const Rubro = require('../modelos/rubros.model');
const { update } = require('../modelos/proveedor.model');
const Venta = require('../modelos/venta.model');
const ItemVenta = require('../modelos/itemVenta.model');

const permisos = {
    master: "MASTER",
    admin: "ADMIN",
    vendedor: "VENDEDOR"
}

router.get('/', validate.verifyAccessToken, async (req, res, next) => { //Obtiene todos los productos
    try {
        const productos = await Producto.findAll({
            include: [{
                model: Stock,
            },
            {
                model: Rubro
            }]
        });
        res.status(200).json(productos);

    } catch (error) {
        next(error);
    }
});

router.get('/operaciones', async (req, res, next) => {
    try {
        const productos = await Producto.findAll({
            include: Stock
        });
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
});

router.get('/productosVendidos', async (req, res, next) => {
    try {
        const ventas = await Venta.findAll({
            where: {
                estadoVenta: "finalizada"
            },
            include: {
                model: ItemVenta
            }
        });

        const productos = await Producto.findAll();
        const productosRevisados = [];
        const productosVendidos = [];

        ventas.ItemsVenta.forEach(item => {
            if (productosRevisados.some(elemento => item.ProductoID === elemento)) return;
            productosRevisados.push(item.ProductoId);
            const mismoProducto = ventas.ItemsVenta.filter(value => {
                return value.ProductoId === item.ProductoId;
            });
            const indice = productos.findIndex(i => i.id === item.ProductoId);
            if (indice < 0) throw createError.InternalServerError('Producto no encontrado');

            const cantidadVendida = mismoProducto.reduce((total, item) => {
                return total + item.cantidad;
            }, 0);
            const totalVendido = precioVenta * cantidadVendida;

            const productoVendido = {
                codigoPaquete: productos[indice].codigoPaquete,
                nombre: productos[indice].nombre,
                marca: productos[indice].marca,
                precioVenta: productos[indice].precioVenta,
                cantidadVendida,
                totalVendido
            };
            productosVendidos.push(productoVendido);
        });

        res.status(200).json(productosVendidos);

    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => { //Crea un producto
    try {
        const { codigoPaquete, ubicacion, nombre, marca,
            descripcion, alertaMin, precio, cantidad, precioVenta, ProveedorId, rubro } = req.body;

        const proveedor = await Proveedor.findByPk(ProveedorId);

        const productFound = await Producto.findOne({
            where: {
                codigoPaquete
            }
        });

        if (productFound) throw createError.Conflict(`Ya existe el producto!`);
        if (!proveedor) throw createError.NotFound('El proveedor seleccionado no fue encontrado');

        const result = await Producto.create({
            codigoPaquete,
            ubicacion,
            nombre,
            marca,
            descripcion,
            alertaMin,
            precioVenta,
            ProveedorId
        });

        const stock = await Stock.create({
            cantidad,
            precioCompra: precio
        });

        await result.addStocks(stock);

        const newRubro = await Rubro.findByPk(rubro);

        await result.setRubro(newRubro);

        const finalProduct = await Producto.findOne({
            where: {
                id: result.id
            },
            include: Stock
        });

        res.status(200).json(finalProduct);

    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => { //Modifica un producto
    try {
        const { id, codigoPaquete, ubicacion, nombre, marca, descripcion, alertaMin, estado, precioVenta, proveedorId } = req.body;

        const productFound = await Producto.findOne({ where: { id } });

        if (!productFound) throw createError.Conflict(`El producto no se encuentra en la base de datos!`);

        const updated = await productFound.update({
            codigoPaquete,
            ubicacion,
            nombre,
            marca,
            descripcion,
            alertaMin,
            estado,
            precioVenta,
            proveedorId
        });

        const updatedProduct = await Producto.findByPk(id, { include: Stock });

        res.status(200).json(updatedProduct);

    } catch (error) {
        next(error);
    }
});

router.put('/rubro', async (req, res, next) => {
    try {
        const { rubro, porcentajeCantidad, aumentar } = req.body;
        // const rubroEncontrado = await Rubro.findByPk(rubro);
        // const productosPorModificar = await rubroEncontrado.getProductos();
        const productosPorModificar = await Producto.findAll({
            where: {
                RubroRubro: rubro
            }
        })
        let updatedCount = 0;
        productosPorModificar.forEach(producto => {
            percent = (porcentajeCantidad / 100);
            const valor = producto.precioVenta * percent;
            let nuevoPrecio;
            if (aumentar) {
                nuevoPrecio = producto.precioVenta + valor;
            } else {
                nuevoPrecio = producto.precioVenta - valor;
            }
            producto.update({ precioVenta: nuevoPrecio }).then(() => updatedCount++)
        });
        res.status(200).send(`updated ${updatedCount} products`);
    } catch (error) {
        next(error);
    }
});

router.post('/repo', async (req, res, next) => {
    try {
        const { id, cantidad, precioCompra } = req.body;

        const producto = await Producto.findByPk(id);

        const stock = await Stock.create({
            cantidad,
            precioCompra
        });

        await producto.addStock(stock);
        const productoFinal = await Producto.findByPk(id, {
            include: Stock
        });
        res.status(201).json(productoFinal);

    } catch (error) {
        next(error);
    }
})

router.delete('/repo/', async (req, res, next) => {
    const { id } = req.body;

    const stock = await Stock.findByPk(id);
    if (!stock) createError.NotFound('La entrada sobre la que se desea operar no fue encontrada');

    await stock.destroy();

    res.sendStatus(200);
});

router.delete('/', async (req, res, next) => { // Elimina el producto
    try {
        const { id } = req.body;
        console.log(req.body);
        const deleted = await Producto.destroy({
            where: {
                id
            }
        });
        if (deleted > 0) res.sendStatus(200);
        else throw createError.NotFound('Item no econtrado');
    } catch (error) {
        next(error);
    }
});

module.exports = router;