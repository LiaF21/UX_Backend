const sequelize = require('../Db');
const {ListaNegra,Reglamento} = require('../models/lista');
const {Persona} = require('../models/persona')

exports.getAllLista = async () =>{
    const list = await ListaNegra.findAll({include: [
        { model: Persona },
        { model: Reglamento }
    ]});
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

exports.editarPersonaInList = async (id, listUpdate) =>{
    const personaLista = await ListaNegra.update(listUpdate, {
        where:{id_lista_negra:id}
    });

    if(personaLista){
        const edited = await ListaNegra.findOne({ 
            where: {id_lista_negra:id}
        });
        return edited;
    }
};