const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Usuario = require('../modelos/usuarios.model');
const Notificacion = require('../modelos/notificacion.model');

router.post('/', async (req, res, next) => {
    try {
        const { remintenteID, destinatarioId, asunto, mensaje } = req.body;
        //TODO: Requiere validacion de datos
        const remintente = await Usuario.findByPk(remintenteID);
        const destinatario = await Usuario.findByPk(destinatarioId);
        if (!remintente) throw createError.NotFound('El Remitente no existe');
        if (!destinatario) throw createError.NotFound('El destinatario seleccionado no fue encontrado');

        const createdProvider = await Notificacion.create({ remintenteID, destinatarioId, asunto, mensaje });
        res.status(201).json(createdProvider);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {

        const { id, remintenteID, destinatarioId, asunto, mensaje } = req.body;

        const prov = await Notificacion.findByPk(id);

        if (!prov) throw createError.NotFound('Notificacion no encontrada');

        const updatedUser = await prov.update({

            remintenteID, destinatarioId, asunto, mensaje
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        const { id } = req.body;
        const result = await Notificacion.destroy({ where: { id } });
        if (result > 0) {
            res.sendStatus(200);
        } else throw createError.NotFound('Notificacion no encontrada');
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const { remintenteID } = req.body;
        const Notificaciones = await Notificacion.findAll(remintenteID);
        res.status(200).json(Notificaciones);
    } catch (error) {
        next(error);
    }
});

module.exports = router;