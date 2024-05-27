const {Procedencia} = require('../models/persona')

exports.crearProcedencia = async (req) =>{
   const {id_procedencia, departamento,municipio} = req.body;
   const nuevaProcedencia = await Procedencia.create({
       id_procedencia,
       departamento,
       municipio,
   })

   return nuevaProcedencia
}

exports.getAllProcedencia = async()=>{
   const procedencias = await Procedencia.findAll();
   return procedencias
}

exports.getProcedencia = async(req)=>{
   const {id} = req.params;
   const ocupacion = await Procedencia.findOne({
      where:{
         id_procedencia:id
      }
   })
   return ocupacion
}

exports.editarProcedencia = async(req)=>{
   const {id} = req.params;
   const {departamento,municipio} = req.body
   const unaProcedencia = await Procedencia.findByPk(id)
   unaProcedencia.departamento= departamento;
   unaProcedencia.municipio = municipio;
   await unaProcedencia.save()
   return unaProcedencia  
 }

 exports.eliminarProcedencia = async(req,res)=>{
   const {id} = req.params;
    await Procedencia.destroy({
      where:{
         id_procedencia:id,
      }
   })
   
 }