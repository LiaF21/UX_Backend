const MiscelanousService = require('../services/Miscelanous');

async function getPersonsInListaEspera(req, res) {
  try {
    const listaEsperaEntries = await MiscelanousService.getPersonsInListaEsperaService();
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

const getReservaciones = async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Please provide startDate and endDate query parameters.' });
  }

  try {
    const reservaciones = await MiscelanousService.getReservaciones(startDate, endDate);
    res.json(reservaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the reservations.' });
  }
};

module.exports = {
  getPersonsInListaEspera,
  getReservaciones
};

