const {Router} = require('express')

const procedenciaController = require('../controllers/procedenciaController');
const ocupacionController = require('../controllers/ocupacionController');
const ListaEsperaController = require('../controllers/listaEsperaController');
const iglesiaController = require('../controllers/iglesiaController');
const iglesiaHuespedController = require('../controllers/iglesiaHuespedController');


const router = Router();


//procedencia
router.get('/procedencia', procedenciaController.getAllProcedencia);
router.post('/procedencia', procedenciaController.crearProcedencia);
router.put('/procedencia/:id',procedenciaController.editarProcedencia);
router.delete('/procedencia/:id',procedenciaController.eliminarProcedencia);
router.get('/procedencia/:id',procedenciaController.getProcedencia);


//ocupacion
router.get('/ocupacion', ocupacionController.getAllOcupacion);
router.post('/ocupacion', ocupacionController.crearOcupacion);
router.put('/ocupacion/:id',ocupacionController.editarOcupacion);
router.delete('/ocupacion/:id',ocupacionController.eliminarOcupacion);
router.get('/ocupacion/:id',ocupacionController.getOcupacion);

//lista espera
router.get('/listaEspera', ListaEsperaController.getAllListaEspera);
router.post('/listaEspera', ListaEsperaController.crearEspera);
router.put('/listaEspera/:id',ListaEsperaController.editarEspera);
router.delete('/listaEspera/:id',ListaEsperaController.eliminarEspera);
router.get('/listaEspera/:id',ListaEsperaController.getListaEspera);

//iglesia
router.get('/iglesia', iglesiaController.getAllIglesia);
router.post('/iglesia', iglesiaController.crearIglesia);
router.put('/iglesia/:id',iglesiaController.editarIglesia);
router.delete('/iglesia/:id',iglesiaController.eliminarIglesia);
router.get('/iglesia/:id',iglesiaController.getIglesia);

//iglesia huesped
router.get('/iglesiaHuesped', iglesiaHuespedController.getAllIglesiaH);
router.post('/iglesiaHuesped', iglesiaHuespedController.crearIglesiaH);
router.put('/iglesiaHuesped/:id',iglesiaHuespedController.editarIglesiaH);
router.delete('/iglesiaHuesped/:id',iglesiaHuespedController.eliminarIglesiaH);
router.get('/iglesiaHuesped/:id',iglesiaHuespedController.getIglesiaH);

module.exports = router;