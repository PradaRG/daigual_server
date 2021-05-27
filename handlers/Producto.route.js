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

router.post('/', async (req, res, next) => { //Crea un producto
    try {
        const { codInterno, codigoPaquete, ubicacion, nombre, marca,
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
            codInterno,
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
            include: {
                models: [Stock]
            }
        });



        res.status(200).json(finalProduct);

    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => { //Modifica un producto
    try {
        const { id, codInterno, codigoPaquete, ubicacion, nombre, marca, descripcion, alertaMin, estado, precioVenta, proveedorId } = req.body;

        const productFound = await Producto.findOne({ where: { id } });

        if (!productFound) throw createError.Conflict(`El producto no se encuentra en la base de datos!`);

        const updated = await productFound.update({
            codInterno,
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