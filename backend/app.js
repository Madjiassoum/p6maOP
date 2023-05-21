const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config();
const fs = require('fs');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// Les ROUTES
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// console.log(process.env.DB_USERNAME);
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch((err) => console.log('Connexion échouée',err));

// il recupere et met à disposition le body en json req.body
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
/* Sécuriser Express en définissant divers en-têtes HTTP */
app.use(helmet({crossOriginResourcePolicy: false,}));

// rendre le dossier images statique
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;