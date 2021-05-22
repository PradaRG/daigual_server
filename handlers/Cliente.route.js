const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Cliente = require('../modelos/cliente.model');




router.post('/', async (req, res, next) => {
    try {
        const { nombre, email, telefono, descripcion } = req.body;
        //TODO: Requiere validacion de datos
        const createdProvider = await Cliente.create({ codigoInterno, nombre, email, telefono, descripcion });
        res.status(201).json(createdProvider);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {

        const { id,  nombre, email, telefono, descripcion } = req.body;

        const prov = await Cliente.findByPk(id);

        if (!prov) throw createError.NotFound('Proveedor no encontrado');

        const updatedUser = await prov.update({
            
            nombre,
            email,
            telefono,
            descripcion
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        const { id } = req.body;
        const result = await Cliente.destroy({ where: { id } });
        if (result > 0) {
            res.sendStatus(200);
        } else throw createError.NotFound('Cliente no encontrado');
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res) => {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
});

module.exports = router;