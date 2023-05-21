const passwordValidator = require('password-validator');

/* Création d'un schéma de données pour les mots  de passe */
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(6)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces

module.exports = passwordSchema;