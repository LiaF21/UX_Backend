const {Router} = require('express')

const ocupacionController = require('../controllers/ocupacionController');

const router = Router();

router.get('/ocupacion', ocupacionController.getAllOcupacion);
router.post('/ocupacion', ocupacionController.crearOcupacion);
router.put('/ocupacion/:id',ocupacionController.editarOcupacion);
router.delete('/ocupacion/:id',ocupacionController.eliminarOcupacion);
router.get('/ocupacion/:id',ocupacionController.getOcupacion);

module.exports = router;