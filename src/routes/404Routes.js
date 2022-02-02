const { Router } = require('express');
const errorController = require('../controllers/404Controller');

const router = Router();

router.get('/error-message', errorController.errorMessage);
router.use(errorController.defaultRoute);

module.exports = router;