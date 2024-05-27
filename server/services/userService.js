const sequelize = require('../Db');
const {Usuario} = require('../models/usuario')


exports.login = async (username, password) => {
  const result = await Usuario.findOne({
    where: {
      nickname: username,
      contrasena:password
    }
  });

  return result;
};

exports.getAllUsers = async () => {
    const users = await Usuario.findAll({include: 'Hospital'});
    return users;
};

exports.getUserById = async (id) => {
   const result = await Usuario.findByPk(id);
   return result;
  };

exports.createUser = async (id_persona, id_hospital, username, password, rol) => {
    const nuevoUser = await Usuario.create({
      id_persona,
      id_hospital, 
      nickname:username,
      contrasena:password,
      rol
    });
    return nuevoUser;
  };
  
  exports.deleteUserById = async (id) => {
    await Usuario.destroy({
      where:{
        id_usuario:id
      }
    });
  };

  exports.authenticateUser = async (username, password) => {
   const result= await Usuario.findOne({
    where:{
      nickname:username,
      contrasena:password
    }
   });

   return result != null;
  };
  
 


