const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Caja = require('../modelos/caja.model');
const ItemVenta = require('../modelos/itemVenta.model');
const Venta = require('../modelos/venta.model');
const Usuario = require("../modelos/usuarios.model");
const { reducirStock } = require('../helpers/Stock_helper');
const Movimientos = require('../modelos/movimientos.model');
const { create } = require('../modelos/usuarios.model');

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
                        }],

                }, {
                    model: Movimientos
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
        const caja = await Caja.findAll({
            include: {
                model: Venta,
                include: {
                    model: ItemVenta
                }
            }
        });
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
                },
                {
                    model: Movimientos
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
router.post('/agregarMovimiento', async (req, res, next) => {
    try {
        const { descripcion, operacion, monto, ventaRapida, CajaId } = req.body;

        const user = await Usuario.findOne({
            where: {
                ventaRapida
            }
        });
        console.log('Usuario ln 122 caja route', user.toJSON());
        if (!user) throw createError.NotFound('Numero de venta rapida invalido');

        const movimientoCreado = await Movimientos.create({ descripcion, operacion, monto, CajaId, UsuarioId: user.id });

        if (!movimientoCreado) throw createError.InternalServerError('No se pudo crear el movimiento');

        res.status(200).json(movimientoCreado);
    } catch (error) {
        next(error);
    }
});

router.post('/agregarVenta', async (req, res, next) => { //Agrega una venta
    try {
        const { venta } = req.body;
        const usuario = await Usuario.findOne({
            where: {
                ventaRapida: venta.ventaRapida
            }
        });

        const nuevaVenta = await Venta.create({
            monto: venta.monto,
            montoTarjeta: venta.montoTarjeta,
            estadoVenta: "finalizada",
            tipoPago: venta.tipoPago,
            descuento: venta.descuento,
            recargo: venta.recargo,
            ClienteId: venta.ClienteId,
            UsuarioId: usuario.id,
            CajaId: venta.CajaId,
            UsuarioId: usuario.id
        });

        if (!nuevaVenta) throw createError.InternalServerError('No se pudo crear la venta');

        const items = venta.ItemsVenta;

        items.forEach(item => {
            ItemVenta.create({
                cantidad: item.cantidad,
                precioVenta: item.precioVenta,
                ProductoId: item.ProductoId
            }).then(item => {
                nuevaVenta.addItemVenta(item);
                reducirStock(item.ProductoId, item.cantidad, item.id);
            }).catch(error => {
                console.log(error);
            });
        });

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;