const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const userService = require('../services/userService');
const crypt = require('../cripto/crypto');

exports.login = async (req, res) => {
  try {
    const passwordLogin = req.body.password;

    const user = await userService.getUserByUsername(req.body.username);

    if (user) {
      const passwordCrypt = user.contrasena;

      const compare = crypt.compare(passwordLogin, passwordCrypt);

      if (!compare) {
        return res.status(401).json({ message: 'Contraseña Incorrecta' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id_usuario, username: user.nickname, role: user.rol },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res
        .status(201)
        .json({ user, token, message: 'Inicio de sesión exitoso' });
    } else {
      return res
        .status(401)
        .json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
