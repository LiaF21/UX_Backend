const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const morgan = require("morgan");
const db = require("./Db");

//Routes
const routes = require("./routes/routes");
const miscelanous = require("./routes/MiscelanousRoutes");
const V = require("./routes/routesV");
const excelRoutes = require("./routes/excelRoutes"); // nueva ruta

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(routes);

app.use(miscelanous);
app.use(V);
app.use('/api', excelRoutes); // nueva ruta



//Esto puede ir en una ruta, servicio y controlador

const initApp = async () => {
  console.log("Testing the database connection..");
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    app.get("/", async (req, res) => {
      //console.log(req);
      return res.send("hello world");
    });

    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

db.sync({ force: false, alter: false})
  .then(() => {
    console.log("Database synced without altering existing schema!");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });


initApp();
