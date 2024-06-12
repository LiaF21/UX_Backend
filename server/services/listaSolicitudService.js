const {ListaSolicitud} = require('../models/lista')
const {Persona} = require('../models/persona')
const {Huesped, PacienteHuesped} = require('../models/huesped')


exports.crearListaSolicitud = async (req) =>{
   const {id_lista_solicitud,id_persona,observacion,fecha_entrada} = req.body;
   const nuevaEspera = await ListaSolicitud.create({
       id_lista_solicitud,
       id_persona,
       observacion,
       fecha_entrada
   })

   return nuevaEspera
}
exports.getSolicitudes = async () => {
   try {
     const solicitudes = await ListaSolicitud.findAll({
       include: {
         model: PacienteHuesped,
         attributes: ['id_paciente_huesped'],
         include: {
           model: Huesped,
           attributes: ['id_huesped'],
           include: {
             model: Persona,
             attributes: ['genero', 'primer_nombre', 'primer_apellido', 'dni']
           }
         }
       }
     });
     return solicitudes;
   } catch (error) {
     console.error("Error fetching solicitudes:", error);
     throw error;
   }
 };
 
 
 
exports.getAllListaSolicitud = async()=>{
   const esperas = await ListaSolicitud.findAll();
   return esperas
}

exports.getSolicitud = async(req,res)=>{
   const {id} = req.params
   const espera = await ListaSolicitud.findOne({
      where:{
         id_lista_solicitud:id
      }
   })
   return espera
}

exports.editarListaSolicitud = async(req)=>{
   const {id} = req.params;
   const {id_persona,observacion} = req.body
   const unaEspera = await ListaSolicitud.findByPk(id)
   unaEspera.id_persona= id_persona;
   unaEspera.observacion=observacion;
   await unaEspera.save()
   return unaEspera  
 }

 exports.eliminarSolicitud = async(req,res)=>{
   const {id} = req.params;
    await ListaSolicitud.destroy({
      where:{
         id_lista_solicitud:id,
      }
   })
   
 }