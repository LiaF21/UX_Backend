const sequelize = require('../Db');
const {Privilegio, UsuarioPrivilegio} = require('../models/usuario');

//Privilegios
exports.getAllPrivilegios = async () =>{
    const privilegios = await Privilegio.findAll();
    return privilegios;
};

exports.getPrivilegioById = async (id) =>{
    const privilegio = await Privilegio.findByPk(id);
    return privilegio;
};

exports.crearPrivilegio = async (privilegioData) =>{
    const nuevoPrivilegio = await Privilegio.create(privilegioData);
    return nuevoPrivilegio;
};

exports.deletePrivilegioById = async (id) =>{
    const borrar = await Privilegio.destroy({
        where:{
            id_privilegio:id
        }
    });
    return borrar;
};

exports.editarPrivilegio = async (id, privilegioUpdate) =>{
    const privilegioEditado = await Privilegio.update(privilegioUpdate, {
        where:{id_privilegio:id}
    });
  
    if(privilegioEditado){
        const edited = await Privilegio.findOne({ 
            where: {id_privilegio:id}
        });
        return edited;
    }
  };

//UsuarioPrivilegio
exports.getAllUsuarioPrivilegios = async () =>{
    const privilegios = await UsuarioPrivilegio.findAll();
    return privilegios;
};

exports.getUsuarioPrivilegioById = async (id) =>{
    const usuarioPrivilegio = await UsuarioPrivilegio.findByPk(id);
    return usuarioPrivilegio;
};

exports.crearUsuarioPrivilegio = async (usuarioPrivilegioData) =>{
    const user = await UsuarioPrivilegio.create(usuarioPrivilegioData);
    return user;
};

exports.deleteUsuarioPrivilegioById = async (id) =>{
    const borrar = await UsuarioPrivilegio.destroy({
        where:{
            id_usuario_privilegio:id
        }
    });
    return borrar;
};
exports.deleteUsuarioPrivilegioById = async (id) =>{
    const borrar = await UsuarioPrivilegio.destroy({
        where:{
            id_usuario_privilegio:id
        }
    });
    return borrar;
};
exports.deleteUsuarioPrivilegioByUserId = async (id) =>{
    const borrar = await UsuarioPrivilegio.destroy({
        where:{
            id_usuario:id
        }
    });
    return borrar;
};
exports.editarUsuarioPrivilegio = async (id, privilegioUsuarioUpdate) =>{
    const usuarioPrivilegioEditado = await UsuarioPrivilegio.update(privilegioUsuarioUpdate, {
        where:{id_usuario_privilegio:id}
    });
  
    if(usuarioPrivilegioEditado){
        const edited = await UsuarioPrivilegio.findOne({ 
            where: {id_usuario_privilegio:id}
        });
        return edited;
    }
  };