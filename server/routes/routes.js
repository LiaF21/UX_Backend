const authController = require('./authController');
const userController = require('./userController');

app.post('/auth/login', authController.login);

app.get('/users', userController.getAllUsers);
app.get('/users/:id', userController.getUserById);

