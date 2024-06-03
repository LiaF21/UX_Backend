const {Router} = require('express')

const iglesiaController = require('../controllers/iglesiaController');

const router = Router();

router.get('/iglesia', iglesiaController.getAllIglesia);
router.post('/iglesia', iglesiaController.crearIglesia);
router.put('/iglesia/:id',iglesiaController.editarIglesia);
router.delete('/iglesia/:id',iglesiaController.eliminarIglesia);
router.get('/iglesia/:id',iglesiaController.getIglesia);

module.exports = router;