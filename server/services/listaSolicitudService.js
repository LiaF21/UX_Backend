const { ListaSolicitud } = require("../models/lista");
const { Persona, Ocupacion, Procedencia, Lugar } = require("../models/persona");
const {
  Huesped,
  PacienteHuesped,
  AfiliadoHuesped,
} = require("../models/huesped");
const sequelize = require("../Db");
const Paciente = require("../models/paciente");
const {Hospital} = require("../models/hospital");
const { Patrono, PatronoAfiliado, Afiliado } = require("../models/afiliado");

const handlePersona = async (personaData) => {
  const persona = await Persona.findOne({
    where: { dni: personaData.dni },
  });

  if (persona) {
    // Existe esa persona en la base de datos
    // Tons lo que vamos hacer es actualizarla

    await persona.update(personaData);

    return persona;
  }

  return await Persona.create(personaData);
};

const handleHuesped = async (personaHuesped) => {
  const huesped = await Huesped.findOne({
    where: { id_persona: personaHuesped.id_persona },
  });

  if (huesped) {
    // Existe esa persona en la base de datos
    // Tons lo que vamos hacer es actualizarla

    await huesped.update({ activo: true, reingreso: true });

    return huesped;
  }

  return await Huesped.create({
    id_persona: personaHuesped.id_persona,
    activo: true,
    reingreso: false,
  });
};

const handlePatrono = async (patronoData) => {
  const patrono = await Patrono.findOne({
    where: { id_patrono: patronoData.id_patrono },
  });

  if (patrono) return patrono;

  throw new Error("No existe el patrono");
};

const handleAfiliado = async (afiliadoData) => {
  const afiliado = await Afiliado.findOne({
    where: { dni: afiliadoData.dni },
  });

  if (afiliado) {
    // Existe esa persona en la base de datos
    // Tons lo que vamos hacer es actualizarla

    await afiliado.update({
      nombre: afiliadoData.nombre,
      condicion: afiliadoData.condicion,
    });

    return afiliado;
  } else {
    return await Afiliado.create(afiliadoData);
  }
};

const handlePatronoAfiliado = async (patronoAfiliadoData) => {
  const patronoAfiliado = await PatronoAfiliado.findOne({
    where: {
      id_patrono: patronoAfiliadoData.id_patrono,
      id_afiliado: patronoAfiliadoData.id_afiliado,
    },
  });

  if (patronoAfiliado) return patronoAfiliado;

  return await PatronoAfiliado.create(patronoAfiliadoData);
};

const handleAfiliadoHuesped = async (afiliadoHuespedData) => {
  const afiliadoHuesped = await AfiliadoHuesped.findOne({
    where: {
      id_afiliado: afiliadoHuespedData.id_afiliado,
      id_huesped: afiliadoHuespedData.id_huesped,
    },
  });

  if (afiliadoHuesped) return afiliadoHuesped;

  return await AfiliadoHuesped.create(afiliadoHuespedData);
};

const handleAddAfiliadoHuesped = async (
  patronoData,
  idAcompanante,
  idHuesped
) => {
  const patrono = await handlePatrono(patronoData);
  const afiliado = await handleAfiliado({
    dni: patronoData.dni_afiliado,
    nombre: patronoData.nombre_afiliado,
  });

  console.log(patrono, afiliado);

  const patronoAfiliado = await handlePatronoAfiliado({
    id_patrono: patrono.id_patrono,
    id_afiliado: afiliado.id_afiliado,
  });

  const afiliadoHuesped = await handleAfiliadoHuesped({
    id_afiliado: afiliado.id_afiliado,
    id_huesped: idHuesped,
  });

  if (idAcompanante) {
    const afiliadoAcompanante = await handleAfiliadoHuesped({
      id_afiliado: afiliado.id_afiliado,
      id_huesped: idAcompanante,
    });
  }
};

exports.crearListaSolicitud = async (data) => {
  console.log(data);
  const {
    huespedData,
    pacienteData,
    acompananteData,
    solicitudData,
    patronoData,
  } = data;

  const probar = await sequelize.transaction();
  try {
    const personaHuesped = await handlePersona(huespedData);

    const personaPaciente = await handlePersona(pacienteData);

    const huesped = await handleHuesped(personaHuesped);

    const paciente = await Paciente.create(
      {
        id_person: personaPaciente.id_persona,
        ...pacienteData,
      },
      { transaction: probar }
    );

    const pacienteHuesped = await PacienteHuesped.create(
      {
        id_paciente: paciente.id_paciente,
        id_huesped: huesped.id_huesped,
        parentesco_paciente: pacienteData.parentesco,
      },
      { transaction: probar }
    );

    const solicitud = await ListaSolicitud.create(
      {
        id_paciente_huesped: pacienteHuesped.id_paciente_huesped,
        ...solicitudData,
      },
      { transaction: probar }
    );

    if (acompananteData) {
      const personaAcompanante = await handlePersona(acompananteData);
      const huespedAcompanante = await handleHuesped(personaAcompanante);

      const pacienteAcompanante = await PacienteHuesped.create(
        {
          id_paciente: paciente.id_paciente,
          id_huesped: huespedAcompanante.id_huesped,
          parentesco_paciente: pacienteData.parentesco,
        },
        { transaction: probar }
      );

      if (patronoData) {
        await handleAddAfiliadoHuesped(
          patronoData,
          huespedAcompanante.id_huesped,
          huesped.id_huesped
        );
      }

      await ListaSolicitud.create(
        {
          id_paciente_huesped: pacienteAcompanante.id_paciente_huesped,
          ...solicitudData,
        },
        { transaction: probar }
      );
    } else {
      if (patronoData) {
        await handleAddAfiliadoHuesped(patronoData, null, huesped.id_huesped);
      }
    }

    await probar.commit();

    return solicitud;
  } catch (error) {
    await probar.rollback();
    throw new Error("Error al crear usuario y persona: " + error.message);
  }
};

exports.getSolicitudes = async () => {
  try {
    const solicitudes = await ListaSolicitud.findAll({
      include: {
        model: PacienteHuesped,
        attributes: ["id_paciente_huesped"],
        include: [
          {
            model: Huesped,
            include: {
              model: Persona,
              include: [
                { model: Ocupacion },
                { model: Procedencia },
                { model: Lugar },
              ],
            },
          },
          {
            model: Paciente,
            include: [
              {
                model: Persona,
                include: [
                  { model: Ocupacion },
                  { model: Procedencia },
                  { model: Lugar },
                ],
              },
              {
                model: Hospital,
              },
            ],
          },
        ],
      },
    });
    return solicitudes;
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    throw error;
  }
};

exports.getAllListaSolicitud = async () => {
  const esperas = await ListaSolicitud.findAll();
  return esperas;
};

exports.getSolicitud = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const espera = await ListaSolicitud.findOne({
    where: { id_lista_solicitud: id },
    include: {
      model: PacienteHuesped,
      attributes: ["id_paciente_huesped"],
      include: [
        {
          model: Huesped,
          include: {
            model: Persona,
            include: [
              { model: Ocupacion },
              { model: Procedencia },
              { model: Lugar },
            ],
          },
        },
        {
          model: Paciente,
          include: [
            {
              model: Persona,
              include: [
                { model: Ocupacion },
                { model: Procedencia },
                { model: Lugar },
              ],
            },
            {
              model: Hospital,
            },
          ],
        },
      ],
    },
  });

  return espera;
};

exports.editarListaSolicitud = async (req) => {
  const { id } = req.params;
  const { id_persona, observacion } = req.body;
  const unaEspera = await ListaSolicitud.findByPk(id);
  unaEspera.id_persona = id_persona;
  unaEspera.observacion = observacion;
  await unaEspera.save();
  return unaEspera;
};

exports.eliminarSolicitud = async (req, res) => {
  const { id } = req.params;
  await ListaSolicitud.destroy({
    where: {
      id_lista_solicitud: id,
    },
  });
};
