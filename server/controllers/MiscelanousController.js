const personaService = require('../services/Miscelanous');

async function getPersonsInListaEspera(req, res) {
  try {
    const listaEsperaEntries = await personaService.getPersonsInListaEsperaService();
    const formattedEntries = listaEsperaEntries.map(entry => ({
      id_lista_espera: entry.id_lista_espera,
      fecha_entrada: entry.fecha_entrada,
      id_persona: entry.Persona.id_persona,
      nombre: `${entry.Persona.primer_nombre} ${entry.Persona.primer_apellido}`,
      telefono: entry.Persona.telefono,
      genero: entry.Persona.genero,
      causa_visita: entry.Persona.Pacientes.map(paciente => paciente.causa_visita).join(', ')
    }));
    res.json(formattedEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPersonsInListaEspera,
};

