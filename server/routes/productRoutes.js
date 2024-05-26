const {Router} = require('express')

const ProductController = require('../controll0ers/productController');
const ProductRouter = Router();
//transacciones
ProductRouter.post('/transacciones', ProductController.createTransaccion);
ProductRouter.get('/transacciones/:id', ProductController.getTransaccionById);
ProductRouter.get('/transacciones', ProductController.getTransaccionesByFecha);

//reglas
ProductRouter.post('/reglas', ProductController.createRegla);
ProductRouter.get('/reglas/:id', ProductController.getReglaById);
ProductRouter.get('/reglamento', ProductController.getReglamento);
ProductRouter.put('/reglas/:id', ProductController.editRegla);

//hospitales
ProductRouter.post('/hospitales', ProductController.createHospital);
ProductRouter.get('/hospitales/:id', ProductController.getHospitalById);
ProductRouter.get('/hospitales', ProductController.getHospitales);
ProductRouter.delete('/hospitales/:id', ProductController.deleteHospitalById);

//pisos
ProductRouter.post('/pisos', ProductController.createPiso);
ProductRouter.get('/pisos/:id', ProductController.getPisoById);

//salas
ProductRouter.post('/salas', ProductController.createSala);
ProductRouter.get('/salas/:id', ProductController.getSalaById);

module.exports = ProductRouter;