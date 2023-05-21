const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, process.env.jwt_DECODEDTOKEN);
        const userId = decodeToken.userId;
        req.auth = { userId };
        if(req.body.userId && req.body.userId !== userId){
            throw('User ID non valid');
        } else {
            next();
        }
    } catch {
        res.status(401).json({ error: 'Requête invalide' });
    }
}