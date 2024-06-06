const {Router} = require('express')

const Product = require('../controllers/productController');
const ProductRouter = Router();
//transacciones
ProductRouter.post('/transacciones', Product.createTransaccion);//funciona
ProductRouter.get('/transacciones/:id', Product.getTransaccionById);//funciona
ProductRouter.get('/transaccion', Product.getTransaccionesByFecha);//funciona
ProductRouter.get('/transaccion/becados', Product.getBecados);//funciona
ProductRouter.get('/transaccion/donaciones', Product.getDonaciones);//funciona

//reglas
ProductRouter.post('/reglas', Product.createRegla);//funciona
ProductRouter.get('/reglas/:id', Product.getReglaById);//funciona
ProductRouter.get('/reglamento', Product.getReglamento);//funciona
ProductRouter.put('/reglas/:id', Product.editRegla);//funciona

//hospitales
ProductRouter.post('/hospitales', Product.createHospital);//funciona
ProductRouter.get('/hospitales/:id', Product.getHospitalById);//funciona
ProductRouter.get('/hospitales', Product.getHospitales);//funciona
ProductRouter.delete('/hospitales/:id', Product.deleteHospitalById);//funciona

//pisos
ProductRouter.post('/pisos', Product.createPiso);//funciona
ProductRouter.get('/pisos/:id', Product.getPisoById);//funciona

//salas
ProductRouter.post('/salas', Product.createSala);//funciona
ProductRouter.get('/salas/:id', Product.getSalaById);//funciona

module.exports = ProductRouter;