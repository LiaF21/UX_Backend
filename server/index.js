require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const db = require('./Db');
const port = process.env.PORT || 3001;
const authenticateJWT = require('./middleware/authenticateJWT');

//Routes
const routes = require('./routes/routes');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(authenticateJWT);
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
    console.error('Unable to connect to the database:', error.message);
    console.error('Parent error:', error.parent);
    console.error('Error details:', error);
  }
};

db.sync({ force: false, alter: false})
  .then(() => {
    console.log('Database synced without altering existing schema!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error.message);
    console.error('Parent error:', error.parent);
    console.error('Error details:', error);
  });

initApp();
