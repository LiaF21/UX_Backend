const userService = require("../services/userService");
const crypt = require("../cripto/crypto");

exports.login = async (req, res) => {
  try {
    const passwordLogin = req.body.password;

    const user = await userService.getUserByUsername(req.body.username);

    if (user) {
      const passwordCrypt = user.contrasena;

      const compare = crypt.compare(passwordLogin, passwordCrypt);

      if (!compare) {
        return res.status(401).json({ message: "Contraseña Incorrecta" });
      }

      return res
        .status(201)
        .json({ user, message: "Inicio de sesión exitoso" });
    } else {
      return res
        .status(401)
        .json({ message: "Nombre de usuario o contraseña incorrectos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
