const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./Db");
const morgan = require("morgan")

//Routes
const routes = require('./routes/routes');


app.use(morgan('dev'))
app.use(cors());
app.use(express.json()); 
app.use(routes)
//Esto puede ir en una ruta, servicio y controlador

app.listen(3001, () => {
  console.log("server has started on port 3001");
});
