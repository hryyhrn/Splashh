const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();
router.use(authController.csrfProtection);

//GET
router.get('/home', authController.home_get);
router.get('/signup', authController.signup_get);
router.get('/login', authController.login_get);
router.get('/signout', authController.signout_get);

//POST
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

module.exports = router;