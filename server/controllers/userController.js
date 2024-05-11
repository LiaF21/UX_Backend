
const userService = require('../services/userService');
const pool = require("../Db");


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
    const { id_persona, id_hospital, username, password, rol } = req.body;
    const newUser = await userService.createUser(id_persona, id_hospital, username, password, rol);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    await userService.deleteUserById(id);
    res.json({ user, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

