const {ListaSolicitud} = require('../models/lista')



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