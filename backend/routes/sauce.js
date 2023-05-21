// Importation de express
const express = require('express');
// Appel EXPRESS pour créer le router
const router = express.Router();

// Pour l'authentification
const auth = require('../middleware/auth');
// Importation du middleware/multer pour gestion des images
const multer = require('../middleware/multer')

//! Importation fichier sauce de controllers
const sauceCtrl = require('../controllers/sauce');

// router
router.post('/',auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id',auth, multer, sauceCtrl.modifySauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislike);

module.exports = router;