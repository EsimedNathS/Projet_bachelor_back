const User = require("../datamodel/user.js");
const bodyParser = require('body-parser');

module.exports = (app, Userservice, jwt) => {

    /*app.get("/verifyToken", async (req, res) => {
        console.log("token api")
        if (!token) {
            return res.status(401).json({ error: 'Token non fourni' });
        }
        try {
            jwt.verify(token, 'votre_clé_secrète', async (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        res.status(403).json({error: 'Token expiré'});
                    } else {
                        res.status(403).json({error: 'Token non valide'});
                    }
                }
            });
        } catch (error) {
            console.error(error);
            res.status(403).json({ error: 'Token non valide' });
        }
    })*/


}