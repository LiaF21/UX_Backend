const {Router} = require('express')

const Product = require('../controllers/productController');
const ProductRouter = Router();
//transacciones
ProductRouter.post('/transacciones', Product.createTransaccion);
ProductRouter.get('/transacciones/:id', Product.getTransaccionById);
ProductRouter.get('/transacciones', Product.getTransaccionesByFecha);

//reglas
ProductRouter.post('/reglas', Product.createRegla);
ProductRouter.get('/reglas/:id', Product.getReglaById);
ProductRouter.get('/reglamento', Product.getReglamento);
ProductRouter.put('/reglas/:id', Product.editRegla);

//hospitales
ProductRouter.post('/hospitales', Product.createHospital);
ProductRouter.get('/hospitales/:id', Product.getHospitalById);
ProductRouter.get('/hospitales', Product.getHospitales);
ProductRouter.delete('/hospitales/:id', Product.deleteHospitalById);

//pisos
ProductRouter.post('/pisos', Product.createPiso);
ProductRouter.get('/pisos/:id', Product.getPisoById);

//salas
ProductRouter.post('/salas', Product.createSala);
ProductRouter.get('/salas/:id', Product.getSalaById);

module.exports = ProductRouter;