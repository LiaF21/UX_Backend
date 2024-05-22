const sequelize = require('../Db');

exports.login = async (username, password) => {
  
    const result = await pool.query('SELECT * FROM usuario WHERE nickname = $1 AND contrasena = $2', [username, password]);
    return result.rows[0];
};

exports.getAllUsers = async () => {
    const users = await pool.query("SELECT * FROM usuario");
    return users.rows;
};

exports.getUserById = async (id) => {
    const result = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1", [id]);
    return result.rows[0];
  };

exports.createUser = async (id_persona, id_hospital, username, password, rol) => {
    const newUser = await pool.query("INSERT INTO usuario ( id_persona, id_hospital, nickname, contrasena, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *", [id_persona, id_hospital, username, password, rol]);
    return newUser.rows[0];
  };
  
  exports.deleteUserById = async (id) => {
    await pool.query("DELETE FROM usuario WHERE id_usuario = $1", [id]);
  };

  exports.authenticateUser = async (username, password) => {
    const result = await pool.query('SELECT * FROM usuario WHERE nickname = $1 AND contrasena = $2', [username, password]);
    return result.rows.length === 1;
  };
  
