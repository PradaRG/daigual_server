const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');
const Producto = require('../modelos/productos.model');
const { create } = require('../modelos/proveedor.model');


router.get('/', async (req, res, next) => {
    try {
        const producto = await Producto.findAll();
        res.status(200).json(producto);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { codInterno, codigoPaquete, ubicacion, nombre, marca,
            descripcion, alertaMin, alertaMax, estado, precio, cantidad, precioVenta, proveedorId } = req.body;

        const proveedor = await Proveedor.findByPk(proveedorId);
        const productFound = await Producto.findOne({
            where: {
                codInterno
            }
        });
        if (productFound) throw createError.Conflict(`Ya existe el producto!`);
        if (!proveedor) throw createError.NotFound('El proveedor seleccionado no fue encontrado');

        const result = await proveedor.createProducto({
            codInterno, codigoPaquete, ubicacion, nombre, marca,
            descripcion, alertaMin, alertaMax, estado, precio, precioVenta, cantidad
        });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
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