const express = require('express');
const createError = require('http-errors');
const Reserva = require('../modelos/reserva.model');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const reservas = await Reserva.findAll();

        res.status(200).json(reservas);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const reservaCreada = await Reserva.create({ ...req.body });
        if (!reservaCreada) throw createError.InternalServerError("No se pudo crear la reserva");
        res.status(200).json(reservaCreada);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const { montoAbonado, estado } = req.body;
        const reservaCreada = await Reserva.update({ montoAbonado, estado });
        if (!reservaCreada) throw createError.InternalServerError("No se pudo crear la reserva");
        res.status(200).json(reservaCreada);
    } catch (error) {
        next(error);
    }
});

module.exports = router;