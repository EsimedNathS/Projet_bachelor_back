const User = require("../datamodel/user.js");
const bodyParser = require('body-parser');

module.exports = (app, Userservice, jwt) => {

    app.get("/user", async (req, res) => {
        try {
            res.json(await Userservice.dao.getAll())
        }
        catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Erreur lors de la récupération des données'})
        }
    })

    app.post("/user", (req, res) => {
        app.use(bodyParser.json());
        const user = req.body
        console.log(req)
        if (!Userservice.dao.isValid(user))  {
            return res.status(400).end()
        }
        Userservice.insert(new User(user.login, user.password))
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/user/:id", async (req, res) => {
        const item = await Userservice.dao.getById(req.params.id)
        if (item === undefined) {
            return res.status(404).end()
        }
        Userservice.dao.delete(req.params.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })


    app.put("/user", async (req, res) => {
        const user = req.body
        if ((user.id === undefined) || (user.id == null) || (!Userservice.dao.isValid(user))) {
            return res.status(400).end()
        }
        if (await Userservice.dao.getById(user.id) === undefined) {
            return res.status(404).end()
        }
        Userservice.dao.update(user)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.post('/user/authenticate', (req, res) => {
        const { login, password } = req.body
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end()
            return
        }
        Userservice.validatePassword(login, password)
            .then(authenticated => {
                if (!authenticated) {
                    res.status(401).end()
                    return
                }
                res.json({'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}