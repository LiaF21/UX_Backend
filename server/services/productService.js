const pool = require('../Db');

exports.createTrasaccion = async(id_huesped,valor,Fecha,becada) =>{
    const result = await pool.query('INSERT INTO transaccion (id_huesped, valor, fecha, becada) VALUES ($1,$2,$3,$4) RETURNING *',[id_huesped,valor,Fecha,becada]);
    return result.rows[0];
   };
 
   exports.getTransaccionById = async (id) => {
     const result = await pool.query("SELECT * FROM transaccion WHERE id_transaccion = $1", [id]);
     return result.rows[0];
   };
 
   exports.getTransaccionesByFecha = async (FechaInicio,FechaFinal) => {
     const result = await pool.query("SELECT * FROM transaccion WHERE fecha_transaccion BETWEEN $1 AND $2", [FechaInicio,FechaFinal]);
     return result;
   };
 
   exports.createRegla = async (noReglas,Desc) =>{
     const result = await pool.query('INSERT INTO reglamento (numero_regla, descripcion_regla) VALUES ($1,$2) RETURNING *',[noReglas,Desc]);
     return result.rows[0];
   };
 
   exports.getReglaById = async (id) => {
     const result = await pool.query("SELECT * FROM reglamento WHERE id_regla = $1", [id]);
     return result.rows[0];
   };

   exports.getReglamento = async () => {
    const result = await pool.query("SELECT * FROM reglamento ");
    return result.rows[0];
  };
 
   exports.editRegla = async (id,noReglas,Desc) => {
     const result = await pool.query("UPDATE reglamento SET numero_regla=$1,descripcion_regla=$2  WHERE id_regla = $3", [noReglas,Desc,id]);
   };

   exports.createHospital = async (nombre, direccion) =>{
    const result = await pool.query('INSERT INTO hospital (nombre, direccion) VALUES ($1,$2) RETURNING *',[nombre, direccion]);
     return result.rows[0];
   };

   exports.getHospitalById = async (id) => {
    const result = await pool.query("SELECT * FROM hospital WHERE id_hospital = $1", [id]);
    return result.rows[0];
  };

  exports.getHospitales = async () => {
    const result = await pool.query("SELECT * FROM hospital ");
    return result.rows[0];
  };
 
  exports.deleteHospitalById = async (id) => {
    const result = await pool.query("DELETE FROM hospital WHERE id_hospital = $1", [id]);
    return result.rows[0];
  };

  exports.createPiso = async (id_hospital, piso) =>{
    const result = await pool.query('INSERT INTO piso (id_hospital, nombre_piso) VALUES ($1,$2) RETURNING *',[id_hospital, piso]);
     return result.rows[0];
   };

   exports.getPisoById = async (id) => {
    const result = await pool.query("SELECT * FROM piso WHERE id_piso = $1", [id]);
    return result.rows[0];
  };

  exports.createSala = async (sala, piso) =>{
    const result = await pool.query('INSERT INTO piso (id_hospital, nombre_piso) VALUES ($2,$1) RETURNING *',[sala, piso]);
     return result.rows[0];
   };

   exports.getSalaById = async (id) => {
    const result = await pool.query("SELECT * FROM sala WHERE id_sala = $1", [id]);
    return result.rows[0];
  };
