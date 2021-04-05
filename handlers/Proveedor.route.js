const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Proveedor = require('../modelos/proveedor.model');

const proveedores = [{
    "codigoInterno": "es",
    "nombre": "El sembrador SRL",
    "email": "elsembrador@yahoo.com",
    "telefono": "343-1234565",
    "descripcion": "Mayorista de bebidas con y sin alcohol"
},
{
    "codigoInterno": "slp",
    "nombre": "Selplast",
    "email": "selplast@google.net",
    "telefono": "343-1132485",
    "descripcion": "Mayorista de articulos de libreria"
}, {
    "codigoInterno": "mnt",
    "nombre": "Montagne",
    "email": "montagne@montagne.com.ar",
    "telefono": "343-121234765",
    "descripcion": "Proveedor de articulos de camping, caza y pesca"
}];


router.post('/', async (req, res, next) => {
    try {
        const { codigoInterno, nombre, email, telefono, descripcion } = req.body;
        //TODO: Requiere validacion de datos
        const createdProvider = await Proveedor.create({ codigoInterno, nombre, email, telefono, descripcion });
        res.status(201).json(createdProvider);
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
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

router.delete('/', async (req, res, next) => {
    try {
        const { id } = req.body;
        const result = await Proveedor.destroy({ where: { id } });
        if (result > 0) {
            res.sendStatus(200);
        } else throw createError.NotFound('Proveedor no encontrado');
    } catch (error) {
        next(error);
    }
})

router.get('/bulk', async (req, res) => {
    const result = await Proveedor.bulkCreate(proveedores);
    res.sendStatus(200);
});

router.get('/', async (req, res) => {
    const proveedores = await Proveedor.findAll();
    res.status(200).json(proveedores);
});

module.exports = router;