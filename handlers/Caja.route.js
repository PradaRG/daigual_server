const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const caja =require('../modelos/caja.model');
const Venta = require('../modelos/venta.model');
const { create } = require('../modelos/venta.model');
router.get('/cjaabierta', async (req, res, next) => {
    try {
        const caja = await caja.findAll({
            where: {
                estado: "ABIERTA"
            }
          });
        res.status(200).json(caja);
    } catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const caja = await caja.findAll();
        res.status(200).json(caja);
    } catch (error) {
        next(error);
    }
});
router.delete('/', async (req, res, next) => {
    try {
        const { id } = req.body;
        const result = await caja.destroy({ where: { id } });
        if (result > 0) {
            res.sendStatus(200);
        } else throw createError.NotFound('Proveedor no encontrado');
    } catch (error) {
        next(error);
    }
});

