const express = require('express');
const createError = require('http-errors');
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
            estado:"finalizada",
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
        const { montoAbonado, estado } = req.body;
        const reservaCreada = await Reserva.update({ montoAbonado, estado });
        if (!reservaCreada) throw createError.InternalServerError("No se pudo crear la reserva");
        res.status(200).json(reservaCreada);
    } catch (error) {
        next(error);
    }
});

module.exports = router;