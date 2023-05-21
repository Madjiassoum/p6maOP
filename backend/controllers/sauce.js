// Importation de sauce
const bodyParser = require("body-parser");
const Sauce = require("../models/sauce");
const jwt = require("jsonwebtoken");
const fs = require('fs');

//! Création
exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  delete sauceObj._id;
  delete sauceObj._userId;
  const sauce = new Sauce({
    ...sauceObj,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  console.log("sauce =>", sauce);
  //enregistrer l'objet dans la base de donné en appelant la méthode save :
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//! get et find() pour toute la liste
exports.getAllSauces = (req, res, next) => {
  // Utilisation de methode find() pr trouver la liste complète
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//! Logique GET avec OneFind :
exports.getOneSauce = (req, res, next) => {
  //pour accéder à l'id, req.params.id :

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//! Logique DELETE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).JSON({message: "Non-autorisé"});        
      }
      else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
            .then(() =>res.status(200).json({ message: "Objet supprimé"}))
            .catch(error => res.status(404).json({ error }))
        })
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//! Logique PUT :
exports.modifySauce = (req, res, next) => {
  
  //l'objet qui va être envoyé dans la base de donnée :
  const sauceObj = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

    /*SUPPRIMER pour ne pas que quelqu'un crée un objet à son nom 
      et qu'il puisse le modifier pour réassigner à un autre*/
    delete sauceObj.userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).JSON({ message: "Non-autorisé" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObj, _id: req.params.id })
            .then(() => res.status(200).JSON({message: "Objet modifié !"}))
            .catch((error) => res.status(404).json({ error }))
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

//! Like or Dislike sauce
exports.likeOrDislike = (req, res, next) => {
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Like en moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Dislike en moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
