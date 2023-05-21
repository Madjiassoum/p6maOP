const User = require("../models/user");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const cryptosJs = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");

//! signup pour l'Enrégistrement pour accès aux sauces liste
exports.signup = (req, res, next) => {
  //chiffrer l'email dans la base de donnée:
  const emailCryptoJs = cryptosJs
    .HmacSHA256(req.body.email, `${process.env.DB_EMAIL}`)
    .toString();

  // hasher le mot de pass, exécuté 10 fois
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur enregistré" }))
        .catch((error) => res.status(400).json({ error:"Vous n'êtes pas encore enrégistré. Reéssayez !"}));
    })
    .catch((error) => res.status(500).json({ error:"Mauvais mot de pass" }));
};

//! login VERIF VALIDITE DE l'utilisateur
exports.login = (req, res) => {
  // Comparer l'email dans la base de donnée s'IL EXISTE
  const emailCryptoJs = cryptosJs
    .HmacSHA256(req.body.email, `${process.env.DB_EMAIL}`)
    .toString();

  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      if (user === null) {
        return res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrrect" });
      } else {
        //le user existe on utilise la méthode compare( ) de bcrypt pour comparer le mot de passe  envoyé par l'utilisateur,
        //avec le hash qui est enregistré avec le user dans la base de donnée :
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Paire identifiant/mot de passe incorrrect" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jsonwebtoken.sign(
                  //user id :
                  { userId: user._id },
                  //la clé de chiffrement du token
                  `${process.env.jwt_DECODEDTOKEN}`,
                  //le temps de validité du token
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
