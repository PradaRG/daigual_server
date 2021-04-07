const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Caja = require('../modelos/caja.model');
const Venta = require('../modelos/venta.model');

router.get('/caja-abierta', async (req, res, next) => { //Obtiene todas las cajas abiertas
    try {
        const caja = await Caja.findAll({
            where: {
                estado: "ABIERTA"
            }
        });
        if (!caja) throw createError.NotFound('No se encontro una caja abierta');

        res.status(200).json(caja);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => { // Trae todas las cajas
    try {
        const caja = await Caja.findAll();
        if (!caja) throw createError.NotFound('No hay cajas creadas');
        res.status(200).json(caja);
    } catch (error) {
        next(error);
    }
});

router.post('/abrir-caja', async (req, res, next) => {
    try {
        const { montoEfectivoInicio } = req.body;
        let turno;
        const hora = new Date().getHours();
        if (hora >= 0 && hora < 15) {
            turno = "MAÑANA";
        } else {
            turno = "TARDE";

        }
        const nuevaCaja = await Caja.create({
            estado: "ABIERTA",
            turno,
            montoTotalVendido: 0,
            montoEfectivoInicio,
            montoEfectivoFinal: 0,
        });
        if (!nuevaCaja) throw createError.InternalServerError('No se pudo crear la caja');
        res.status(201).json(nuevaCaja);
    } catch (error) {
        next(error);
    }
});

router.post('/cerrar-caja', async (req, res, next) => {
    try {

        const { id, montoEfectivoFinal } = req.body;
        const caja = await Caja.findByPk(id);

        if (!caja) throw createError('No se encuentra la caja sobre la que desea operar');
        caja.update({
            estado: "CERRADA",
            montoEfectivoFinal
        });
        res.sendStatus(200);

    } catch (error) {
        next(error);
    }

});

router.post('/agregar', async (req, res, next) => { //Agrega una venta
    try {
        const { id, ventaId } = req.body;

        const caja = await Caja.findByPk(id);
        const venta = await Venta.findByPk(ventaId);
        if (!caja) throw createError('Caja no encontrada');
        if (!venta) throw createError('Venta no encontrada, asegurese de haber concretado la operacion');
        await caja.setVenta(venta);

        montoTotalVendido = caja.montoTotalVendido + venta.monto;
        await caja.update(montoTotalVendido);

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;