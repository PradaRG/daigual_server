const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');




router.post('/', async (req, res, next) => {
    try {
        const { codigoInterno, nombre, email, telefono, descripcion } = req.body;
        //TODO: Requiere validacion de datos

        let inputEmail;
        let inputTelefono;
        let inputDescripcion;

        (descripcion === '') ? inputDescripcion = null : inputDescripcion = descripcion;
        (telefono === '') ? inputTelefono = null : inputTelefono = telefono;
        (email === '') ? inputEmail = null : inputEmail = email;

        const createdProvider = await Proveedor.create({ codigoInterno, nombre, email: inputEmail, telefono: inputTelefono, descripcion: inputDescripcion });
        res.status(201).json(createdProvider);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {

        const { id, codigoInterno, nombre, email, telefono, descripcion } = req.body;

        const prov = await Proveedor.findByPk(id);

        if (!prov) throw createError.NotFound('Proveedor no encontrado');

        const updatedUser = await prov.update({
            codigoInterno,
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
        const result = await Proveedor.destroy({ where: { id } });
        if (result > 0) {
            res.sendStatus(200);
        } else throw createError.NotFound('Proveedor no encontrado');
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res) => {
    const proveedores = await Proveedor.findAll();
    res.status(200).json(proveedores);
});

module.exports = router;