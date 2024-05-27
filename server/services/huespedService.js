const sequelize = require('../Db');
const {Huesped} = require('../models/huesped');

exports.getAllHuespedes = async () =>{
    const huespedes = await Huesped.findAll();
    return huespedes;
};

exports.getHuespedById = async (id) =>{
    const huesped = await Huesped.findByPk(id);
    return huesped;
};

exports.crearHuesped = async (huespedData) =>{
    const nuevoHuesped = await Huesped.create(huespedData);
    return nuevoHuesped;
};

exports.deleteHuespedById = async (id) =>{
    const borrar = await Huesped.destroy({
        where:{
            id_huesped:id
        }
    });
    return borrar;
};

