const {ListaEspera } = require('../models/lista');
const Paciente = require('../models/paciente');
const {Persona} = require('../models/persona');
const sequelize = require('../Db');

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

const getReservaciones = async (startDate, endDate) => {
  const query = `
    SELECT 
      CONCAT(p.primer_nombre, '', p.primer_apellido) AS nombre,
      CONCAT(hab.nombre, ' - ', c.nomre) AS se_hospeda,
      r.fecha_salida
    FROM 
      reservacion r
    JOIN 
      paciente_huesped ph ON r.id_paciente_huesped = ph.id_paciente_huesped
    JOIN 
      huesped h ON ph.id_huesped = h.id_huesped
    JOIN 
      persona p ON h.id_persona = p.id_persona
    JOIN 
      cama c ON r.id_cama = c.id_cama
    JOIN 
      habitacion hab ON c.id_habitacion = hab.id_habitacion
    WHERE 
      r.fecha_salida BETWEEN :startDate AND :endDate
      AND r.activa = true;
  `;
  const replacements = { startDate, endDate };
  const [results] = await sequelize.query(query, { replacements });
  return results;
};

module.exports = {
  getPersonsInListaEsperaService,
  getReservaciones
};


