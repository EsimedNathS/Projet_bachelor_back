const User = require("../datamodel/user.js");
const bodyParser = require('body-parser');

module.exports = async (app, UserService, ProgrammeService, ExerciceService, jwt) => {

    app.get("/verifyToken", jwt.validateJWT, async (req, res) => {
        return res.end();
    })

    app.post("/user", async (req, res) => {
        app.use(bodyParser.json());
        const user = req.body
        // Vérifie le login
        if (!await UserService.isValidLogin(user['login'])) {
            return res.status(402).end()
        }
        // Vérifie si le User est valide
        if (!UserService.isValidUser(user)) {
            return res.status(401).end()
        }
        // Enregistre le User
        UserService.insertUser(new User(user.login, user.password))
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/user", jwt.validateJWT, (req, res) => {
        UserService.dao.delete(req.user.id)
            .then(_ =>
                ProgrammeService.dao.deleteAllProg(req.user.id)
                    .then(_ =>
                        ExerciceService.dao.deleteAllFavori(req.user.id)
                            .then(_ => res.status(200).end())
                            .catch(e => {
                                console.log(e)
                                res.status(500).end()
                            })
                    )
                    .catch(e => {
                        console.log(e)
                        res.status(500).end()
                    })
            )
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    });

    app.post('/user/authenticate', async (req, res) => {
        const {login, password} = req.body
        // Vérifie si le login et le password sont bien définis
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end()
            return
        }
        if (await UserService.isValidLogin(login)) {
            return res.status(401).end()
        }
        // Vérifie si le login/mdp existe bien
        UserService.validatePassword(login, password)
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