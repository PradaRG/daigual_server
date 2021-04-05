const router = require('express').Router();
const createError = require('http-errors');
const Rubro = require('../modelos/rubros.model');

const RubrosIniciales = [
    { "rubro": 'Acero' },
    { "rubro": 'Marroquineria' },
    { "rubro": 'Lenceria' },
    { "rubro": 'Bazar' },
    { "rubro": 'Juguete' },
    { "rubro": 'Libreria' },
    { "rubro": 'Peluches' },
    { "rubro": 'Regaleria' },
    { "rubro": 'Santeria' },
    { "rubro": 'Otros' },
    { "rubro": 'Ferreteria' }
];

router.get('/', async (req, res, next) => {
    try {
        const rubros = await Rubro.findAll();
        res.status(200).json(rubros);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { rubro } = req.body;
        console.log(rubro);
        const rubroExiste = await Rubro.findByPk(rubro);
        if (rubroExiste) throw createError.Conflict('El rubro ya existe');
        const rubroCreado = await Rubro.create({rubro});
        res.status(201).send(rubroCreado);
    } catch (error) {
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        const { rubro } = req.body;
        const deleted = Rubro.destroy({
            where: {
                rubro
            }
        });
        if (deleted === 0) throw createError('No existe el rubro');
        res.status(200).send('Eliminado correctamente');
    } catch (error) {
        next(error);
    }
});

router.post('/inicializar', async (req, res, next) => {
    try {
        const rubros = await Rubro.bulkCreate(RubrosIniciales);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;