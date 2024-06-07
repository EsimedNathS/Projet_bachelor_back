const User = require("../datamodel/user.js");
const bodyParser = require('body-parser');

module.exports = async (app, Userservice, jwt) => {

    app.get("/verifyToken", jwt.validateJWT, async (req, res) => {
        return res.end();
    })

    app.post("/user", async (req, res) => {
        app.use(bodyParser.json());
        const user = req.body
        // Vérifie le login
        if (!await Userservice.isValidLogin(user['login'])) {
            return res.status(402).end()
        }
        // Vérifie si le User est valide
        if (!Userservice.isValidUser(user)) {
            return res.status(401).end()
        }
        // Enregistre le User
        Userservice.insertUser(new User(user.login, user.password))
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/user", jwt.validateJWT, (req, res) => {
        UserService.dao.delete(req.user.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    });

    app.post('/user/authenticate', (req, res) => {
        const {login, password} = req.body
        // Vérifie si le login et le password sont bien définis
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end()
            return
        }
        // Vérifie si le login/mdp existe bien
        Userservice.validatePassword(login, password)
            .then(authenticated => {
                if (!authenticated) {
                    res.status(401).end()
                    return
                }
                res.json({'token': jwt.generateJWT(authenticated.id)})
            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}