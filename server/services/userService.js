const pool = require('./db');

exports.login = async (username, password) => {
    // Perform login query using pool
    const result = await pool.query('SELECT * FROM Casa_david.usuario WHERE nickname = $1 AND password = $2', [username, password]);
    return result.rows[0];
};

exports.getAllUsers = async () => {
    const users = await pool.query("SELECT * FROM Casa_david.usuario");
    return users.rows;
};

