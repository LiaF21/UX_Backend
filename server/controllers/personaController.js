const perService = require('../services/personaService');

exports.getAllPersonas = async (req, res) => {
    try{
    const people = await perService.getAllPersonas();
    res.status(201).json(people);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getPersonaById = async (req, res) => {

  try{
    const personaID = req.params.id;
    const person = await perService.getPersonaById(personaID);
    if(person){
      res.status(201).json(person);
    }else{
      res.status(404).json({message:'Persona no encontrado,'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

exports.getPersonaByDni = async (req, res) => {
  try{
    const dni = req.params.dni;
    const person = await perService.getPersonaByDni(dni);
    if(person){
      res.status(201).json(person);
    }else{
      res.status(404).json({message:'Persona no encontrado,'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

exports.createPersona = async (req, res) => {
  try {
    const { id_persona, id_ocupacion, id_procedencia, dni, primer_nombre, segundo_nombre, primero_apellido, segundo_apellido, direccion, telefono, genero, fecha_nacimiento } = req.body;
    const nuevaPersona = await perService.createPersona(req.body);
    res.status(201).json(nuevaPersona);
  } catch (error) {
    console.error('Error al crear persona:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deletePersonaById = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedPersona = await perService.deletePersonaById(id);
      if (deletedPersona) {
          res.status(201).json({ message: 'Persona eliminada exitosamente' });
      } else {
          res.status(404).json({ message: 'Persona no encontrada' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.editarPersona = async(req, res)=>{
  try{
    const {id} = req.params;
    const updated = req.body;
    const personaEditado = await perService.editarPersona(id, updated);
    if(personaEditado){
      res.status(201).json({message: 'Persona editada con exito'});
    }else{
      res.status(404).json({message: 'Error al editar persona'});
    }
    
  }catch (error){
    res.status(500).json({error: error.message});
  }
};