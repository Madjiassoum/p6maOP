const passwordSchema = require('../models/password');

/* Ce module fournit une validation de base des mots de passe. */
module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        return res.status(400).json({error: "Le MDP doit faire 10 caractère au moins, avec une maj, une min et un chiffre au moins!" + passwordSchema.validate(req.body.password, {list:true})})
    }else{
        next();
    }
};