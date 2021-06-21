const express = require('express');
const createError = require('http-errors');
const { reducirStock } = require('../helpers/Stock_helper');
const router = express.Router();
const Caja = require('../modelos/caja.model');
const Historial = require('../modelos/historial.model');
const ItemVenta = require('../modelos/itemVenta.model');
const Venta = require('../modelos/venta.model');


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

        const venta = await Venta.findByPk(itemVenta.VentaId,
            {
                include: {
                    model: ItemVenta
                }
            });

        if (!venta) throw createError.NotFound('Venta no encontrada');

        let existing;

        venta.ItemsVenta.forEach(
            item => {
                if (item.ProductoId === itemVenta.ProductoId) {
                    existing = item.id;
                }
            });

        if (existing) await item.increment('cantidad', itemVenta.cantidad);
        if (!existing) await venta.addItemVenta({ ...itemVenta });

        reducirStock(item.ProductoId, item.cantidad, item.id);

        res.sendStatus(200);
    } catch (error) {
        next(error)
    }
});

module.exports = router;