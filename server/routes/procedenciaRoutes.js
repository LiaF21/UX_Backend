const {Router} = require('express')

const procedenciaController = require('../controllers/procedenciaController');

const router = Router();

router.get('/procedencia', procedenciaController.getAllProcedencia);
router.post('/procedencia', procedenciaController.crearProcedencia);
router.put('/procedencia/:id',procedenciaController.editarProcedencia);
router.delete('/procedencia/:id',procedenciaController.eliminarProcedencia);
router.get('/procedencia/:id',procedenciaController.getProcedencia);

module.exports = router;