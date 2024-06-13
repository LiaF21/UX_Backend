const { DataTypes } = require("sequelize");
const sequelize = require("../Db");
const { Piso, Sala, Hospital } = require("./hospital");
const { Persona } = require("./persona");
const { PAGLOCK } = require("sequelize/lib/table-hints");

const Paciente = sequelize.define(
  "Paciente",
  {
    id_paciente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_paciente: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    id_hospital: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_piso: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    causa_visita: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "paciente",
    timestamps: false,
  }
);

Paciente.belongsTo(Hospital, { foreignKey: "id_hospital" });
Paciente.belongsTo(Sala, { foreignKey: "id_sala" });
Paciente.belongsTo(Piso, { foreignKey: "id_piso" });

Hospital.hasMany(Paciente, { foreignKey: "id_hospital" });
Sala.hasMany(Paciente, { foreignKey: "id_sala" });
Piso.hasMany(Paciente, { foreignKey: "id_piso" });

module.exports = Paciente;
