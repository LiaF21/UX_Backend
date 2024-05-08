const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./Db");

app.use(cors());
app.use(express.json()); 

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    
    const result = await pool.query('SELECT * FROM usuario WHERE nickname = $1 AND contrasena = $2', [username, password]);
    if (result.rows.length > 0) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("server has started on port 3001");
});
