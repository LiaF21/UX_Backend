const {Router} = require('express')

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = Router();

router.post('/auth/login', authController.login); //Funciona
router.get('/usuarios/:id', userController.getUserById); //Funciona
router.post('/usuarios/create', userController.createUser); // Funciona
router.delete('/usuarios/:id', userController.deleteUserById); //Funciona
router.get('/usuarios', userController.getAllUsers); // Funciona

module.exports = router;
//Depende de cuantas request vamos a necesitar, es más para tener ese orden por si por ejemplo
//Nelson o Kelvin quierenn revisar el back-end, asi les salva tiempo de andar chequeando cada archivo