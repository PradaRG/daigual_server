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

function getMethods(obj) {
    var result = [];
    for (var id in obj) {
        try {
            if (typeof (obj[id]) == "function") {
                result.push(id + ": " + obj[id].toString());
            }
        } catch (err) {
            result.push(id + ": inaccessible");
        }
    }
    return result;
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
            descripcion, alertaMin, precio, cantidad, precioVenta, proveedorId, rubro } = req.body;

        const proveedor = await Proveedor.findByPk(proveedorId);
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
            precioVenta
        });

        const stock = await Stock.create({
            cantidad,
            precioCompra: precio
        });

        await result.addStocks(stock);

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
        const { id, codInterno, codigoPaquete, ubicacion, nombre, marca, descripcion, alertaMin, alertaMax, estado, precio, cantidad, precioVenta, proveedorId } = req.body;

        const productFound = await Producto.findOne({ where: { id } });

        if (!productFound) throw createError.Conflict(`El producto no se encuentra en la base de datos!`);

        const reposiciones = productFound.reposiciones;
        last = reposiciones.length - 1;
        reposiciones[last].costoCompra = precio;
        reposiciones[last].cantidadAdquirida = cantidad;

        const updated = await productFound.update({
            codInterno,
            codigoPaquete,
            ubicacion,
            nombre,
            marca,
            descripcion,
            alertaMin,
            alertaMax,
            estado,
            reposiciones,
            precioVenta,
            proveedorId
        });

        res.status(200).json(updated);

    } catch (error) {
        next(error);
    }
});

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