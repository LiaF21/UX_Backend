const {ListaEspera} = require('../models/lista')



exports.crearListaEspera = async (req) =>{
   const {id_lista_espera,id_persona,observacion,fecha_entrada} = req.body;
   const nuevaEspera = await ListaEspera.create({
       id_lista_espera,
       id_persona,
       observacion,
       fecha_entrada
   })

   return nuevaEspera
}

exports.getAllListaEspera = async()=>{
   const esperas = await ListaEspera.findAll();
   return esperas
}

exports.getEspera = async(req,res)=>{
   const {id} = req.params
   const espera = await ListaEspera.findOne({
      where:{
         id_lista_espera:id
      }
   })
   return espera
}

exports.editarListaEspera = async(req)=>{
   const {id} = req.params;
   const {id_persona,observacion} = req.body
   const unaEspera = await ListaEspera.findByPk(id)
   unaEspera.id_persona= id_persona;
   unaEspera.observacion=observacion;
   await unaEspera.save()
   return unaEspera  
 }

 exports.eliminarEspera = async(req,res)=>{
   const {id} = req.params;
    await ListaEspera.destroy({
      where:{
         id_lista_espera:id,
      }
   })
   
 }