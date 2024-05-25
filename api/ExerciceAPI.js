const Exercice = require("../datamodel/exercice");
module.exports = (app, ExerciceService, jwt) => {

    app.get("/exercice", jwt.validateJWT, async (req, res) => {
        res.json(await ExerciceService.dao.getAll());
    });

    app.get("/exercice/favori", jwt.validateJWT, async (req, res) => {
        try {
            // Récupération des favoris
            const id_favoris = await ExerciceService.dao.getAllFavori(req.user.id);
            const promises = [];
            // Recherche des ID dans la table exercice
            id_favoris.forEach(id => {
                promises.push(ExerciceService.dao.getById(id['idexo']));
            });
            //Retour des résultats
            Promise.all(promises)
                .then(results => {
                    res.json(results);
                })
                .catch(error => {
                    console.error("Error:", error);
                    res.status(500).send("Internal Server Error");
                });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.post("/exercice/favori", jwt.validateJWT, (req, res) => {
        const exercice_id = req.body['exercice_id']
        // Ajout de l'exercice en favori pour le User
        ExerciceService.dao.insertExoFavori(exercice_id, req.user.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/exercice/favori", jwt.validateJWT, (req, res) => {
        const exercice_id = req.body['exercice_id']
        // Delete de l'exercice en favori pour le User
        ExerciceService.dao.deleteExoFavori(exercice_id, req.user.id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}