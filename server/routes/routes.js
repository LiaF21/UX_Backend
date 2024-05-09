const authController = require('./authController');
const userController = require('./userController');

app.post('/auth/login', authController.login);
router.get('/usuarios/:id', userController.getUserById);
router.post('/usuarios/create', userController.createUser);
router.delete('/usuarios/delete', userController.deleteUserById);
app.get('/usuarios', userController.getAllUsers);

