const sequelize = require("../Db");
const { Huesped } = require("../models/huesped");
const { Persona } = require("../models/persona");
const { Reservacion, Cama, Habitacion } = require("../models/reservaciones");

exports.getAllHuespedes = async () => {
  const huespedes = await Huesped.findAll({ include: "Persona" });
  return huespedes;
};

exports.getHuespedById = async (id) => {
  const huesped = await Huesped.findByPk(id);
  return huesped;
};
exports.getAllHuespedesName = async () => {
  const huespedes = await Huesped.findAll({
    include: [
      {
        model: Reservacion,
        attributes: ["fecha_entrada", "fecha_salida"],
        include: [
          {
            model: Cama,
            attributes: ["nomre"],
            include: [
              {
                model: Habitacion,
                attributes: ["nombre"],
              },
            ],
          },
        ],
      },
      {
        model: Persona,
        attributes: ["primer_nombre", "primer_apellido"],
      },
    ],
  });
  return huespedes;
};
exports.crearHuesped = async (huespedData) => {
  const nuevoHuesped = await Huesped.create(huespedData);
  return nuevoHuesped;
};

exports.deleteHuespedById = async (id) => {
  const borrar = await Huesped.destroy({
    where: {
      id_huesped: id,
    },
  });
  return borrar;
};

exports.editarHuesped = async (id, huespedUpdate) => {
  const huespedEditado = await Huesped.update(huespedUpdate, {
    where: { id_huesped: id },
  });

  if (huespedEditado) {
    const edited = await Huesped.findOne({
      where: { id_huesped: id },
    });
    return edited;
  }
};
