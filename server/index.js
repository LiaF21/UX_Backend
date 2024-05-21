const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const morgan = require('morgan');
const db = require('./Db')

const sequelize = require('./Db');

//Routes
const routes = require('./routes/routes');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(routes);
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

initApp();
