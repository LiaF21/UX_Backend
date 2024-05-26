const listaNegraService = require ('../services/listaNegraService');

exports.getList = async (req, res) => {
    try{
    const people = await listaNegraService.getAllLista();
    res.json(people);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getPersonaInList = async (req, res) => {

  try{
    const personaID = req.params.id;
    const person = await listaNegraService.getPersonaInList(personaID);
    if(person){
      res.json(person);
    }else{
      res.status(404).json({message:'Persona no encontrada,'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

exports.addPersonToList = async (req, res) => {
  try {
    const { id_lista_negra, id_persona, id_regla, observacion} = req.body;
    const nuevaPersona = await listaNegraService.addToList(req.body);
    res.status(201).json(nuevaPersona);
  } catch (error) {
    console.error('Error al añadir persona:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.sacarDeLista = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedPersona = await listaNegraService.deletePersonFromList(id);
      if (deletedPersona) {
          res.json({ message: 'Persona fuera de la lista' });
      } else {
          res.status(404).json({ message: 'Persona no encontrada' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};