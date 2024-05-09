const express = require("express");
const userService = require('./userService');
const app =  express();
const cors = require("cors");
const pool = require("./db");


app.use(cors());
app.use(express.json()); 

app.listen(5000,()=>{
    console.log("server has started on port 5000")
})


exports.getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.json(user);
};

exports.createUser = async (req, res) => {
  try {
    const { id_usuario, id_persona, id_hospital, username, password, rol } = req.body;
    const newUser = await userService.createUser(id_usuario, id_persona, id_hospital, username, password, rol);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUserById(id);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Similar functions for delete and create user

//Query de Login
app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM Casa_david.usuario WHERE nickname = $1 AND password = $2', [username, password]);
      if (result.rows.length === 1) {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
      } else {
        res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
      }
    } catch (error) {
      console.error('Error al realizar la consulta:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

  //Todos los User
  app.get("", async(req,res) =>{
    try {
        const AllUsers = await pool.query("SELECT * FROM Casa_david.usuario")
        res.json(AllUsers.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//User especifico
app.get("",async (req,res)=>{
    try{
      const {id} = req.params;
      const result = await pool.query("SELECT * FROM Casa_david.usuario WHERE id_usuario = $1",[id])

      res.json(todo.rows[0]);
    }catch (err) {
    console.error(err.message)
    }
})


//Eliminar un user
app.delete("",async(req,res)=>{
    try {
      const {id} = req.params
      const deleteUser = await pool.query("DELETE FROM Casa_david.usuario WHERE id_Usuario = $1",[id])  
      res.json("User was deleted")
    } catch (err) {
        console.log(err.message)
    }
})

//Crear User
app.post("", async(req,res)=>{
    try{
        const {id_usuario,id_persona,id_hospital,username,password,rol} = req.body;
        const newTodo = await pool.query("INSERT INTO Casa_david.usuario (id_usuario,id_persona,id_hospital,nickname,contrasena,rol) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",[id_usuario,id_persona,id_hospital,username,password,rol]);

        res.json(newTodo.rows[0])
    }catch (err){
        console.error(err.message);
    }
})