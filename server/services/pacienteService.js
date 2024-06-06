const sequelize = require('../Db');
const Paciente = require('../models/paciente');
const {Persona, Ocupacion} = require('../models/persona')

exports.getAllPacientes = async () =>{
    const pacientes = await Paciente.findAll({include: 'Persona'});
    return pacientes;
};

exports.getPacienteById = async (id) =>{
    const paciente = await Paciente.findByPk(id);
    return paciente;
};

exports.createPaciente = async (pacienteData ) =>{
    const nuevoPaciente = await Paciente.create(pacienteData);
    return nuevoPaciente;
};

exports.deletePacienteById = async (id) =>{
    const borrar =await Paciente.destroy({
        where:{
            id_paciente:id
        }
    });
    return borrar;
};

exports.editarPaciente = async (id, pacienteUpdate) =>{
    const pacienteEditado = await Paciente.update(pacienteUpdate, {
        where:{id_paciente:id}
    });

    if(pacienteEditado){
        const edited = await Paciente.findOne({ 
            where: {id_paciente:id}
        });
        return edited;
    }
};

exports.getAllPacientesWithPersona = async () =>{
    const pacientes = await Paciente.findAll({include: [
        {
            model: Persona,
            include: [{model: Ocupacion, attributes: [['descripcion', 'ocupacion']]}],
            attributes: [['primer_nombre', 'nombre'],['primer_apellido', 'apellido'],['dni', 'id'], 'genero']
        }
    ], attributes: [['causa_visita', 'causa']]});
    return pacientes;
};
