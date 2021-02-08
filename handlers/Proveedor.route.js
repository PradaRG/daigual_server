const express = require('express');
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


router.post('/create', async(req, res) =>{

    const {codigoInterno, nombre, email, telefono, descripcion} = req.body;
    //TODO: Requiere validacion de datos
    const createdProvider = await Proveedor.create({codigoInterno, nombre, email, telefono, descripcion});
    res.status(201).json(createdProvider);
});

router.get('/bulk', async (req, res)=> {
const result =await Proveedor.bulkCreate(proveedores);
res.sendStatus(200);
});

module.exports = router;