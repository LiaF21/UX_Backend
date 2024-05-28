const userService = require("../services/userService");

exports.login = async (req, res) => {
  try {
    const user = await userService.login(req.body.username, req.body.password);
    if (user) {
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
