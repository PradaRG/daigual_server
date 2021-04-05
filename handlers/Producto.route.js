const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');
const Producto = require('../modelos/productos.model');
const Rubro = require('../modelos/rubros.model');
const { create } = require('../modelos/proveedor.model');


router.get('/', async (req, res, next) => {
    try {
        const producto = await Producto.findAll();
        res.status(200).json(producto);
    } catch (error) {
        next(error);
    }
});

//TODO: Crear metodo put para modificar productos;

router.post('/', async (req, res, next) => {
    try {
        const { codInterno, codigoPaquete, ubicacion, nombre, marca,
            descripcion, alertaMin, alertaMax, estado, precio, cantidad, precioVenta, proveedorId, rubro } = req.body;

        const proveedor = await Proveedor.findByPk(proveedorId);
        const productFound = await Producto.findOne({
            where: {
                codigoPaquete
            }
        });
        if (productFound) throw createError.Conflict(`Ya existe el producto!`);
        if (!proveedor) throw createError.NotFound('El proveedor seleccionado no fue encontrado');

        const result = await proveedor.createProducto({
            codInterno,
            codigoPaquete,
            ubicacion,
            nombre,
            marca,
            descripcion,
            alertaMin,
            alertaMax,
            estado,
            reposiciones: [{
                costoCompra: precio,
                cantidadAdquirida: cantidad,
                fecha: Date.now()
            }],
            precioVenta,
            cantidad
        });
        result.setRubro(rubro);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const { id, codInterno, codigoPaquete, ubicacion, nombre, marca, descripcion, alertaMin, alertaMax, estado, precio, cantidad, precioVenta, proveedorId } = req.body;

        const productFound = await Producto.findOne({ where: { id } });

        if (!productFound) throw createError.Conflict(`El producto no se encuentra en la base de datos!`);

        const reposiciones = productFound.reposiciones;
        last = reposiciones.length -1;
        reposiciones[last].costoCompra = precio;
        reposiciones[last].cantidadAdquirida = cantidad;

        const updated = await productFound.update({
            codInterno,
            codigoPaquete,
            ubicacion,
            nombre,
            marca,
            descripcion,
            alertaMin,
            alertaMax,
            estado,
            reposiciones,
            precioVenta,
            proveedorId
        });

        res.status(200).json(updated);

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