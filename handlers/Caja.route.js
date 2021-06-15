const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Caja = require('../modelos/caja.model');
const ItemVenta = require('../modelos/itemVenta.model');
const Venta = require('../modelos/venta.model');

router.get('/caja-abierta', async (req, res, next) => { //Obtiene la caja abierta
    try {
        const caja = await Caja.findOne({
            where: {
                estado: "ABIERTA"
            },
            include: [
                {
                    model: Venta,
                    include: [
                        {
                            model: ItemVenta
                        }]
                }
            ]
        });
        if (!caja) throw createError.NotFound('No se encontro una caja abierta');

        res.status(200).json(caja);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => { // Trae todas las cajas
    try {
        const caja = await Caja.findAll({ include: Venta });
        if (!caja) throw createError.NotFound('No hay cajas creadas');
        res.status(200).json(caja);
    } catch (error) {
        next(error);
    }
});

router.post('/abrir-caja', async (req, res, next) => {
    try {
        const { montoEfectivoInicio } = req.body;

        const cajaAbiertaExiste = await Caja.findOne({
            where: {
                estado: "ABIERTA"
            }
        });


        if (cajaAbiertaExiste) throw createError('Ya existe una caja abierta en el sistema');

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

        const id = nuevaCaja.id;

        const cajaResult = await Caja.findOne({
            where: {
                estado: "ABIERTA"
            },
            include: [
                {
                    model: Venta,
                    include: [
                        {
                            model: ItemVenta
                        }]
                }
            ]
        });

        res.status(201).json(cajaResult);
    } catch (error) {
        next(error);
    }
});

router.put('/cerrar-caja', async (req, res, next) => {
    try {

        const { id, montoEfectivoFinal } = req.body;
        const caja = await Caja.findByPk(id);

        if (!caja) throw createError('No se encuentra la caja sobre la que desea operar');
        await caja.update({
            estado: "CERRADA",
            montoEfectivoFinal
        });
        res.sendStatus(200);

    } catch (error) {
        next(error);
    }

});

router.post('/agregarVenta', async (req, res, next) => { //Agrega una venta
    try {
        const { id } = req.body;

        Caja.findByPk(id).then(res => {
            if (!res) throw createError.notFound('No se encontro la caja buscada');
            res.createVenta();
        }).catch(err => next(err));

        const caja = await Caja.findByPk(id, { include: Venta });
        res.status(200).json(caja);
    } catch (error) {
        next(error);
    }
});

module.exports = router;