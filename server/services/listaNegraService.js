const sequelize = require('../Db');
const {ListaNegra} = require('../models/lista');

exports.getAllLista = async () =>{
    const list = await ListaNegra.findAll();
    return list;
};

exports.getPersonaInList = async (id)=>{
    const person = await ListaNegra.findByPk(id);
    return person;
};

exports.addToList = async (personData) =>{
    const nueva = await ListaNegra.create(personData);
    return nueva;
};

exports.deletePersonFromList = async (id) =>{
    const borrar = await ListaNegra.destroy({
        where:{
            id_lista_negra:id
        }
    });
    return borrar;
};
