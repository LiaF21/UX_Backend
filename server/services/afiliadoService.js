const sequelize = require('../Db');
const {Afiliado, Patrono, PatronoAfiliado} = require('../models/afiliado');


//Afiliados
exports.getAllAfiliado = async () =>{
    const afiliados = await Afiliado.findAll();
    return afiliados;
};

exports.getAfiliadoById = async (id) =>{
    const afiliado = await Afiliado.findByPk(id, {include: 'Persona'});
    return afiliado;
};

exports.crearAfiliado = async (afiliadoData) =>{
    const nuevoAfiliado = await Afiliado.create(afiliadoData);
    return nuevoAfiliado;
};

exports.deleteAfiliadoById = async (id) =>{
    const borrar = await Afiliado.destroy({
        where:{
            id_afiliado:id
        }
    });
    return borrar;
};

//Patrono
exports.getAllPatrono = async () =>{
    const patronos = await Patrono.findAll();
    return patronos;
};

exports.getPatronoById = async (id) =>{
    const patrono = await Patrono.findByPk(id);
    return patrono;
};

exports.crearPatrono = async (patronoData) =>{
    const nuevoPatrono = await Patrono.create(patronoData);
    return nuevoPatrono;
};

exports.deletePatronoById = async (id) =>{
    const borrar = await Patrono.destroy({
        where:{
            id_patrono:id
        }
    });
    return borrar;
};

//PatronoAfiliado
exports.getAllPatronoAfiliado = async () =>{
    const patronosAfiliados = await PatronoAfiliado.findAll();
    return patronosAfiliados;
};

exports.getPatronoAfiliadoById = async (id) =>{
    const patronoAfiliado = await PatronoAfiliado.findByPk(id);
    return patronoAfiliado;
};

exports.crearPatronoAfiliado = async (patronoData) =>{
    const nuevoPatronoAfiliado = await PatronoAfiliado.create(patronoData);
    return nuevoPatronoAfiliado;
};

exports.deletePatronoAfiliadoById = async (id) =>{
    const borrar = await PatronoAfiliado.destroy({
        where:{
            id_patrono_afiliado:id
        }
    });
    return borrar;
};

