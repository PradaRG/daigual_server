const express = require('express');
const createError = require('http-errors');
const { create } = require('../modelos/proveedor.model');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');

const proveedores = [{
    "codigoInterno": "es",
    "nombre": "El sembrador SRL",
    "email": "sembrame@esta.com",
    "telefono": "343-1234565",
    "descripcion": "Vendemos alcohol para emborrachar a tu suegra"
},
{
    "codigoInterno": "pc",
    "nombre": "Pollos calisa",
    "email": "tupolla@sabrosa.net",
    "telefono": "343-1132485",
    "descripcion": "A las chicas de verdad les gusta el pollo frito"
}, {
    "codigoInterno": "cm",
    "nombre": "Chango mas",
    "email": "changuito@chichon.com",
    "telefono": "343-121234765",
    "descripcion": "Precios bajos todos los dias"
}];


router.post('/create', async (req, res, next) => {

    const { codigoInterno, nombre, email, telefono, descripcion } = req.body;
    //TODO: Requiere validacion de datos
    const createdProvider = await Proveedor.create({ codigoInterno, nombre, email, telefono, descripcion });
    res.status(201).json(createdProvider);
});

router.post('/update', async (req, res, next) => {
try {
    
    const { id, codigoInterno, nombre, email, telefono, descripcion } = req.body;

    const prov = await Proveedor.findByPk(id);

    if (!prov) throw createError.NotFound('Proveedor no encontrado');

    const updatedUser = await prov.update({
        codigoInterno,
        nombre,
        email,
        telefono,
        descripcion
    });
res.status(200).json(updatedUser);
} catch (error) {
   next(error);
}
});

router.get('/bulk', async (req, res) => {
    const result = await Proveedor.bulkCreate(proveedores);
    res.sendStatus(200);
});

router.get('/getAll', async (req, res) => {
    const proveedores = await Proveedor.findAll();
    res.status(200).json(proveedores);
});

module.exports = router;