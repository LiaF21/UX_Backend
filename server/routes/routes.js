const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = Router();

router.post('/auth', )
router.post('/auth/login', authController.login);
router.get('/usuarios/:id', userController.getUserById);
router.post('/usuarios/create', userController.createUser);
router.delete('/usuarios/delete', userController.deleteUserById);
router.get('/usuarios', userController.getAllUsers);

