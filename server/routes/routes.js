const authController = require('./authController');
const userController = require('./userController');

app.post('/auth/login', authController.login);
router.get('/usuarios/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/', userController.deleteUserById);
app.get('/', userController.getAllUsers);

