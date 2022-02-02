const { Router } = require('express');
const paletteController = require('../controllers/paletteController');

const router = Router();
router.use(paletteController.csrfProtection);

//Middleware imports
const { requireAuth } = require('../middleware/authMiddleware');

//GET
router.get('/my-page', requireAuth, paletteController.myPage);
router.get('/my-palettes', requireAuth, paletteController.myPalettes);

//POST
router.post('/save-palette', requireAuth, paletteController.savePalette);

//DELETE
router.delete('/delete-palette', requireAuth, paletteController.deletePalette);

module.exports = router;