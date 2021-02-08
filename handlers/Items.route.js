const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');


router.post('/getall', (req, res) => {
    const items = Items.findAll();

    res.status(200).json(items);
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