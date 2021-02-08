const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');
const Producto = require('../modelos/productos.model');


router.get('/getall', async (req, res) => {
    const producto = await Producto.findAll();
    res.status(200).json(producto);
});

router.post('/create', async (req, res, next) => {
    try {
        //TODO: Falta validacion verdadera de datos
        const { codigoInterno, codigoPaquete, ubicacion, nombre, marca,
            descripcion, alertaMin, alertaMax, estado, precio, cantidad, proveedorId } = req.body;
    
        const proveedor = await Proveedor.findByPk(proveedorId);
    
        if (!proveedor) throw createError.NotFound('El proveedor seleccionado no fue encontrado');
    
        const result = await proveedor.createProducto({
            codigoInterno, codigoPaquete, ubicacion, nombre, marca,
            descripcion, alertaMin, alertaMax, estado, precio, cantidad
        });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
    

});

module.exports = router;