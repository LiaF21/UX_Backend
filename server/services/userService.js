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

  exports.getUserByUsername = async (username) =>{
    const result = await Usuario.findOne({
      where:{
        nickname: username
      }
    });
    return result;
  }

exports.createUser = async (dataUsuario) => {
    const nuevoUser = await Usuario.create(dataUsuario);
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
  
  exports.editarUser = async(id, userUpdate)=>{
    const userEditado = await Usuario.update(userUpdate, {
      where:{id_usuario:id}
    });

    if(userEditado){
      const edited=await Usuario.findOne({
        ehre:{id_usuario:id}
      });
      return edited;
    }
  };


