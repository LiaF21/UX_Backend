const sequelize = require('../Db');
const {Persona} = require('../models/persona');

exports.getAllPersonas = async () =>{
    const people = await Persona.findAll();
    return people;
};

exports.getPersonaById = async (id)=>{
    const person = await Persona.findByPk(id);
    return person;
};

exports.createPersona = async (personaData)=>{
    const nuevaPer = await Persona.create(personaData);
    return nuevaPer;
};

exports.deletePersonaById= async (id) =>{
    const borrar = await Persona.destroy({
        where:{
            id_persona:id
        }
    });
    return borrar;
};

exports.editarPersona = async (id, personaUpdate) =>{
    const personaEditada = await Persona.update(personaUpdate, {
        where:{id_persona:id}
    });

    if(personaEditada){
        const edited = await Persona.findOne({ 
            where: {id_persona:id}
        });
        return edited;
    }
};

exports.getPersonaByDNI = async (dni)=>{
    const person = await Persona.findOne({where: {dni: dni}});
    return person;
};