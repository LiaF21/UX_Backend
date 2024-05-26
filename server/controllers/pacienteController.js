const pacienteService = require('../services/pacienteService');

exports.getAllPacientes = async (req, res) => {
    try{
    const pacientes = await pacienteService.getAllPacientes();
    res.json(pacientes);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
};

exports.getPacienteById = async (req, res) => {

  try{
    const pacienteID = req.params.id;
    const paciente = await pacienteService.getPacienteById(pacienteID);
    if(paciente){
      res.json(paciente);
    }else{
      res.status(404).json({message:'Paciente no encontrado,'});
    }
  }catch(error){
    res.status(500).json({error:error.message});
  }
};


exports.createPaciente = async (req, res) => {
  try {
    //probar si funciona
    const { id_paciente, id_person, id_hospital, id_piso, id_sala, causa_visita, observacion } = req.body;
    const nuevoPaciente = await pacienteService.createPaciente(req.body);
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deletePacienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await pacienteService.deletePacienteById(id);
    if(paciente){
      res.json({ message: 'Paciente eliminado exitosamente'});
    }else{
      res.status(404).json({message: 'Paciente no encontrado'});
    }
  } catch (error) {
    console.error('Error al eliminar al paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
