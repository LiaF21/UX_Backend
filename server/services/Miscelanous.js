const {ListaEspera } = require('../models/lista');
const Paciente = require('../models/paciente');
const {Persona} = require('../models/persona');

async function getPersonsInListaEsperaService() {
  return await ListaEspera.findAll({
    include: [
      {
        model: Persona,
        attributes: ['primer_nombre', 'primer_apellido', 'telefono', 'genero'],
        include: [
          {
            model: Paciente,
            attributes: ['causa_visita']
          }
        ]
      }
    ],
    attributes: ['id_lista_espera', 'fecha_entrada', 'id_persona']
  });
}

module.exports = {
  getPersonsInListaEsperaService,
};


