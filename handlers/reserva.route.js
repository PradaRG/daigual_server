const express = require('express');
const createError = require('http-errors');
const Caja = require('../modelos/caja.model');
const Cliente = require('../modelos/cliente.model');
const Movimientos = require('../modelos/movimientos.model');
const Producto = require('../modelos/productos.model');
const Reserva = require('../modelos/reserva.model');
const Usuario = require('../modelos/usuarios.model');
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
        const cliente = await Cliente.findByPk(reservaCreada.ClienteId);
        const producto = await Producto.findByPk(reservaCreada.ProductoId);

        const user = await Usuario.findOne({
            where: {
                ventaRapida: req.body.ventaRapida
            }
        });

        await Movimientos.create({
            descripcion: `Pago del cliente ${cliente.nombre}, por la reserva del producto ${producto.nombre}`,
            operacion: "deposito",
            monto: reservaCreada.montoAbonado,
            UsuarioId: user.id,
            estado: "finalizada",
            CajaId: req.body.CajaId,
            ReservaId: reservaCreada.id
        });
        res.status(200).json(reservaCreada);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const { reserva, ventaRapida, monto, CajaId } = req.body;

        const cliente = await Cliente.findByPk(reserva.ClienteId);
        const producto = await Producto.findByPk(reserva.ProductoId);

        const user = await Usuario.findOne({
            where: {
                ventaRapida
            }
        });

        const reservaAlmacenada = await Reserva.findByPk(reserva.id);

        const nuevoTotal = reservaAlmacenada.montoAbonado + parseInt(monto);

        console.log('Nuevo total',nuevoTotal);

        if (nuevoTotal > reservaAlmacenada.monto) throw createError.InternalServerError("El monto supera el valor del producto");

        await reservaAlmacenada.update({ montoAbonado: nuevoTotal });

        await Movimientos.create({
            descripcion: `Pago del cliente ${cliente.nombre}, por la reserva del producto ${producto.nombre}`,
            operacion: "deposito",
            monto,
            UsuarioId: user.id,
            estado: "finalizada",
            CajaId: CajaId,
            ReservaId: reserva.id
        });




        res.status(200).json(reservaAlmacenada);
    } catch (error) {
        next(error);
    }
});

module.exports = router;