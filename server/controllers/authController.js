const userService = require('./userService');

exports.login = async (req, res) => {

    const user = await userService.login(req.body.username, req.body.password);
    if (user) {

        res.json({ message: 'Inicio de sesión exitoso' });
    } else {

        res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }
};
