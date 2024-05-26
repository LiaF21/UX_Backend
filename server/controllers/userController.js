
const userService = require('../services/userService');


exports.getAllUsers = async (req, res) => {
    try{
    const users = await userService.getAllUsers();
    res.json(users);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {

  try{
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if(user){
      res.json(user);
    }else{
      res.status(404).json({message:'Usuario no encontrado,'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
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
    if(user){
      await userService.deleteUserById(id);
      res.json({user, message: 'Usuario eliminado exitosamente'});
    }else{
      res.status(404).json({message: 'Usuario no encontrado'});
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

