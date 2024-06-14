const {Router} = require('express')

const rutasV = require('./routesV');
const rutasF = require('./routesF');
const rutasL = require('./productRoutes');
//const rutasA = require('./roomRoutes');
const rutasD = require('./routesD');


const router = Router();

//rutas D = Ocupacion, Procedencia, Iglesia, Iglesia Huesped, Lista de Espera
router.use( rutasD);

//rutasV = Users, Auth, Persona, Paciente, Paciente Huesped, Huesped, Lista Negra
router.use( rutasV);

//rutas F = Privilegios, Usuario_Privilegio, Patrono, Afiliado, Afiliado Huesped, Patrono Huesped
router.use( rutasF);

//rutasA = Habitacion, Cama, Reservacion
//router.use(rutasA);

// rutasL = Transaccion, Reglamento, Hospital, Piso, Sala
router.use( rutasL);

module.exports = router;
//Depende de cuantas request vamos a necesitar, es más para tener ese orden por si por ejemplo
//Nelson o Kelvin quierenn revisar el back-end, asi les salva tiempo de andar chequeando cada archivo