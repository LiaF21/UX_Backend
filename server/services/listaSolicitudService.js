const {ListaSolicitud} = require('../models/lista')
<<<<<<< Updated upstream

=======
const {Persona} = require('../models/persona')
const {Huesped, PacienteHuesped} = require('../models/huesped')
const sequelize = require('../Db')
const Paciente = require('../models/paciente')
>>>>>>> Stashed changes


exports.crearListaSolicitud = async (personaData, persona2Data, huespedData, pacienteData, pacientehuespedData) =>{
  const probar = await sequelize.transaction();
  try{
   const nuevaPersona = await Persona.create(personaData, {probar});
   huespedData.id_huesped = nuevaPersona.id_persona;
   const nuevoHuesped = await Huesped.create(huespedData,  {probar});

   const nuevoPersona2 = await Persona.create(persona2Data,  {probar});
   pacienteData.id_persona = nuevoPersona2.id_persona;
   const nuevaPaciente = await Paciente.create(pacienteData, {probar});

    pacientehuespedData.id_huesped = nuevoHuesped.id_huesped;
    pacientehuespedData.id_paciente = nuevaPaciente.id_paciente;
    const nuevoPHData = await PacienteHuesped.create(pacientehuespedData, {probar});
    
    await probar.commit();
    return nuevoPHData;

   }catch (error) {
    await probar.rollback();
    throw new Error('Error al crear usuario y persona: ' + error.message);
   }
}

exports.getAllListaSolicitud = async()=>{
   const esperas = await ListaSolicitud.findAll();
   return esperas
};

exports.getSolicitud = async(req,res)=>{
   const {id} = req.params
   const espera = await ListaSolicitud.findOne({
      where:{
         id_lista_solicitud:id
      }
   })
   return espera
};

exports.editarListaSolicitud = async(req)=>{
   const {id} = req.params;
   const {id_persona,observacion} = req.body
   const unaEspera = await ListaSolicitud.findByPk(id)
   unaEspera.id_persona= id_persona;
   unaEspera.observacion=observacion;
   await unaEspera.save()
   return unaEspera  
 };

 exports.eliminarSolicitud = async(req,res)=>{
   const {id} = req.params;
    await ListaSolicitud.destroy({
      where:{
         id_lista_solicitud:id,
      }
   })
 };

