const Exercice = require("../datamodel/exercice");
module.exports = (app, ExerciceService, jwt) => {

    app.get("/exercice", jwt.validateJWT, async (req, res) => {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ error: 'Token non fourni' });
        }
        res.json(await ExerciceService.dao.getAll());
    });

    app.get("/exercice/favori", jwt.validateJWT, async (req, res) => {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ error: 'Token non fourni' });
        }
        res.json(await ExerciceService.dao.getAllFavori());
    });

    app.post("/exercice", (req, res) => {
        const exercice = req.body
        console.log(req)
        if (!ExerciceService.dao.isValidExo(exercice))  {
            return res.status(400).end()
        }
        ExerciceService.dao.insertExo(new Exercice(exercice.name,exercice.description,exercice.groupe,exercice.type))
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.post("/exercice/favori", jwt.validateJWT, (req, res) => {
        const exercice_id = req.body['exercice_id']
        ExerciceService.dao.insertExoFavori(exercice_id, req.user.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })


    app.delete("/exercice/:id", async (req, res) => {
        const exercice = await ExerciceService.dao.getById(req.params.id)
        if (exercice === undefined) {
            return res.status(404).end()
        }
        ExerciceService.dao.delete(req.params.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.put("/exercice", async (req, res) => {
        const exercice = req.body
        if ((exercice.id === undefined) || (exercice.id == null) || (!ExerciceService.dao.isValidExo(exercice))) {
            return res.status(400).end()
        }
        if (await ExerciceService.dao.getById(exercice.id) === undefined) {
            return res.status(404).end()
        }
        ExerciceService.dao.update(exercice)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

}