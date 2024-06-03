const {Router} = require('express')

const ListaEsperaController = require('../controllers/listaEsperaController');

const router = Router();

router.get('/listaEspera', ListaEsperaController.getAllListaEspera);
router.post('/listaEspera', ListaEsperaController.crearEspera);
router.put('/listaEspera/:id',ListaEsperaController.editarEspera);
router.delete('/listaEspera/:id',ListaEsperaController.eliminarEspera);
router.get('/listaEspera/:id',ListaEsperaController.getListaEspera);

module.exports = router;