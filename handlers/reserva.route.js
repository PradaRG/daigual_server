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

module.exports = router;