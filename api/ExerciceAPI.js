const Exercice = require("../datamodel/exercice");
module.exports = (app, ExerciceService) => {

    app.get("/exercice", async (req, res) => {
        const token = req.header('Authorization');

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
                } else {
                    res.json(await ExerciceService.dao.getAll());
                }
            });
        } catch (error) {
            console.error(error);
            res.status(403).json({ error: 'Token non valide' });
        }
    });

    app.post("/exercice", (req, res) => {
        const exercice = req.body
        console.log(req)
        if (!ExerciceService.dao.isValid(exercice))  {
            return res.status(400).end()
        }
        ExerciceService.dao.insert(new Exercice(exercice.name,exercice.description,exercice.groupe,exercice.type))
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
        if ((exercice.id === undefined) || (exercice.id == null) || (!ExerciceService.dao.isValid(exercice))) {
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