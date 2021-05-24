const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');
const Producto = require('../modelos/productos.model');
const Stock = require("../modelos/stock.model");
const Usuario = require('../modelos/usuarios.model');
const validate = require('../helpers/jwt_helper');
const { Op, INTEGER } = require('sequelize');

const permisos = {
    master: "MASTER",
    admin: "ADMIN",
    vendedor: "VENDEDOR"
}

router.get('/', validate.verifyAccessToken, async (req, res, next) => { //Obtiene todos los productos
    try {
        const productos = await Producto.findAll({
            include: {
                model: Stock,
                where: {
                    cantidad: {
                        [Op.gt]: 0
                    }
                }
            }
        });
        //TODO: Comprobar que hay productos
        res.status(200).json(productos);

    } catch (error) {
        next(error);
    }
});

router.get('/operaciones', async (req, res, next) => {
    try {

        const productos = await Producto.findAll({
            include: Stock
        });
        res.status(200).json(productos);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => { //Crea un producto
    try {
        const { codInterno, codigoPaquete, ubicacion, nombre, marca,
            descripcion, alertaMin, precio, cantidad, precioVenta, ProveedorId, rubro } = req.body;

        const proveedor = await Proveedor.findByPk(ProveedorId);
        const productFound = await Producto.findOne({
            where: {
                codigoPaquete
            }
        });
        if (productFound) throw createError.Conflict(`Ya existe el producto!`);
        if (!proveedor) throw createError.NotFound('El proveedor seleccionado no fue encontrado');

        const result = await Producto.create({
            codInterno,
            codigoPaquete,
            ubicacion,
            nombre,
            marca,
            descripcion,
            alertaMin,
            precioVenta,
            ProveedorId
        });

        const stock = await Stock.create({
            cantidad,
            precioCompra: precio
        });

        await result.addStocks(stock);

        await result.setRubro(rubro);

        const finalProduct = await Producto.findOne({
            where: {
                id: result.id
            },
            include: {
                model: Stock
            }
        });



        res.status(200).json(finalProduct);

    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => { //Modifica un producto
    try {
        const { id, codInterno, codigoPaquete, ubicacion, nombre, marca, descripcion, alertaMin, estado, precioVenta, proveedorId } = req.body;

        const productFound = await Producto.findOne({ where: { id } });

        if (!productFound) throw createError.Conflict(`El producto no se encuentra en la base de datos!`);

        const updated = await productFound.update({
            codInterno,
            codigoPaquete,
            ubicacion,
            nombre,
            marca,
            descripcion,
            alertaMin,
            estado,
            precioVenta,
            proveedorId
        });

        res.status(200).json(updated);

    } catch (error) {
        next(error);
    }
});

router.post('/repo', async (req, res, next) => {
    try {
        const { id, cantidad, precio } = req.body;

        const producto = await Producto.findByPk(id, {
            include: Stock
        });

        const stock = await Stock.create({
            cantidad,
            precioCompra: precio
        });

        producto.addStock(stock);

        res.status(201).json(producto);

    } catch (error) {
        next(error);
    }
})

router.delete('/', async (req, res, next) => { // Elimina el producto
    try {
        const { id } = req.body;
        console.log(req.body);
        const deleted = await Producto.destroy({
            where: {
                id
            }
        });
        if (deleted > 0) res.sendStatus(200);
        else throw createError.NotFound('Item no econtrado');
    } catch (error) {
        next(error);
    }
});

module.exports = router;