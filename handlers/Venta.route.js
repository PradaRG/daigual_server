const express = require('express');
const createError = require('http-errors');
const { reducirStock } = require('../helpers/Stock_helper');
const router = express.Router();
const Caja = require('../modelos/caja.model');
const Historial = require('../modelos/historial.model');
const ItemVenta = require('../modelos/itemVenta.model');
const Venta = require('../modelos/venta.model');


router.post('/', async (req, res, next) => {
    try {
        const { id } = req.body;

        const caja = await Caja.findByPk(id);
        console.log(req.body);
        if (!caja) throw createError.NotFound('No se encontro la caja requerida');

        const nuevaVenta = await caja.createVenta();

        const ventaConItems = await Venta.findByPk(nuevaVenta.id, {
            include: {
                model: ItemVenta
            }
        })

        res.status(200).json(ventaConItems);

    } catch (error) {
        next(error);
    }
});

router.put('/history', async (req, res, next) => {
    try {
        const { id, cantidad } = req.body;

        const historialActualizado = await Historial.findByPk(id);
        historialActualizado.update({
            cantidad
        });

        res.status(200).json(historialActualizado);

    } catch (error) {
        next(error)
    }
})

router.post('/history', async (req, res, next) => {
    try {
        const { cantidad, StockId, ItemVentaId } = req.body;

        const historialCreado = await Historial.create({
            cantidad,
            StockId,
            ItemVentaId
        });

        res.status(200).json(historialCreado);
    } catch (error) {
        next(error)
    }
});

router.post('/add-item', async (req, res, next) => {
    try {
        const { itemVenta } = req.body;
        console.log('req.body', itemVenta);
        const [item, created] = await ItemVenta.findOrCreate({
            where: {
                ProductoId: itemVenta.ProductoId,
                VentaId: itemVenta.VentaId
            },
            defaults: { ...itemVenta }
        });
        reducirStock(item.ProductoId, item.cantidad, item.id);
        const venta = await Venta.findByPk({
            where: {
                id: itemVenta.VentaId
            }
        });
        console.log(venta);
        res.status(200).json(venta);
    } catch (error) {
        next(error)
    }
});

module.exports = router;