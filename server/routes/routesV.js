const {Router} = require('express')

//rutas de Valeria por mientras decidimos lo de los archivos
const personaController = require('../controllers/personaController');
const huespedController = require('../controllers/huespedController');
const pacienteController = require('../controllers/pacienteController');
const paciente_huespedController = require('../controllers/pacienteHuespedController');
const listaNegraController = require('../controllers/listaNegraController');
const router = Router();


//rutas de personas
router.get('/persona/:id', personaController.getPersonaById); //funciona
router.post('/persona/create', personaController.createPersona);//funciona
router.delete('/persona/:id', personaController.deletePersonaById); //funciona
router.get('/personas', personaController.getAllPersonas); //funciona

//rutas de pacientes
router.get('/paciente/:id', pacienteController.getPacienteById); //funciona
router.post('/paciente/create', pacienteController.createPaciente);//funciona
router.delete('/paciente/:id', pacienteController.deletePacienteById); //funciona
router.get('/pacientes', pacienteController.getAllPacientes); //funciona

//rutas de lista negra
router.get('/lista-negra/:id', listaNegraController.getPersonaInList);//funciona
router.post('/lista-negra/create', listaNegraController.addPersonToList);//funciona
router.delete('/lista-negra/:id', listaNegraController.sacarDeLista);//funciona
router.get('/lista-negra', listaNegraController.getList); //funciona

//rutas de huesped
router.get('/huesped/:id', huespedController.getHuespedById); //funciona
router.post('/huesped/create', huespedController.createHuesped);//funciona
router.delete('/huesped/:id', huespedController.deleteHuespedById); //funciona
router.get('/huespedes', huespedController.getAllHuespedes); //funciona

router.get('/paciente-huesped/:id', paciente_huespedController.getPHByID); 
router.post('/paciente-huesped/create', paciente_huespedController.createPH);
router.delete('/paciente-huesped/:id', paciente_huespedController.deletePHById); 
router.get('/paciente-huespedes', paciente_huespedController.getAllPH); 




module.exports = router;