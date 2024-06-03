const {Router} = require('express')

const iglesiaHuespedController = require('../controllers/iglesiaHuespedController');

const router = Router();

router.get('/iglesiaHuesped', iglesiaHuespedController.getAllIglesiaH);
router.post('/iglesiaHuesped', iglesiaHuespedController.crearIglesiaH);
router.put('/iglesiaHuesped/:id',iglesiaHuespedController.editarIglesiaH);
router.delete('/iglesiaHuesped/:id',iglesiaHuespedController.eliminarIglesiaH);
router.get('/iglesiaHuesped/:id',iglesiaHuespedController.getIglesiaH);

module.exports = router;