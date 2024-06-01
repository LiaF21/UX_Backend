const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const morgan = require('morgan');
const db = require('./Db')


//Routes
const routes = require('./routes/routes');
const routesF = require('./routes/routesF')
const product = require('./routes/productRoutes');
const routesV = require('./routes/routesV')

const routesOcupacion = require('./routes/ocupacionRoutes')
const routesProcedencia = require('./routes/procedenciaRoutes')
const routesIglesia = require('./routes/iglesiaRoutes')
const routesIglesiaH = require('./routes/iglesiaHuespedRoutes')
const routesListaE = require('./routes/listaEsperaRoutes')
const routesMiscelanous = require('./routes/MiscelanousRoutes');
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(routes, routesF, routesV);
app.use(product);
app.use(routesOcupacion);
app.use(routesProcedencia);
app.use(routesIglesia);
app.use(routesListaE);
app.use(routesIglesiaH);
app.use(routesMiscelanous);

//Esto puede ir en una ruta, servicio y controlador

const initApp = async () => {
  console.log('Testing the database connection..');
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    app.get('/', async (req, res) => {
      //console.log(req);
      return res.send('hello world');
    });

    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

db.sync({ force: false, alter: false })
  .then(() => {
    console.log('Database synced without altering existing schema!');
  })
  .catch(error => {
    console.error('Error syncing database:', error);
  });

initApp();
