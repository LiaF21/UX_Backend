const pool = require('./db');

exports.login = async (username, password) => {
    // Perform login query using pool

    /* Daniel Omar Dubon Garcia (creo)
    Lee este comentario
    Te va a tocar arreglar todos los servicios y reemplazar los queries con lo de Knex o Sequelize
    Mira, tenes que hacer los queries en Knex y usando la nueva base de datos, la que se llama postgres
    Esa es tu chamba
    */ 
    const result = await pool.query('SELECT * FROM Casa_david.usuario WHERE nickname = $1 AND password = $2', [username, password]);
    return result.rows[0];
};

exports.getAllUsers = async () => {
    const users = await pool.query("SELECT * FROM Casa_david.usuario");
    return users.rows;
};

exports.getUserById = async (id) => {
    const result = await pool.query("SELECT * FROM Casa_david.usuario WHERE id_usuario = $1", [id]);
    return result.rows[0];
  };

exports.createUser = async (id_usuario, id_persona, id_hospital, username, password, rol) => {
    const newUser = await pool.query("INSERT INTO Casa_david.usuario (id_usuario, id_persona, id_hospital, nickname, contrasena, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [id_usuario, id_persona, id_hospital, username, password, rol]);
    return newUser.rows[0];
  };
  
  exports.deleteUserById = async (id) => {
    await pool.query("DELETE FROM Casa_david.usuario WHERE id_usuario = $1", [id]);
  };

  exports.authenticateUser = async (username, password) => {
    const result = await pool.query('SELECT * FROM Casa_david.usuario WHERE nickname = $1 AND password = $2', [username, password]);
    return result.rows.length === 1;
  };
  
