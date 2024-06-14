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
        const exercice_id = req.body['exercice_id'];
        if (exercice_id == null || exercice_id == undefined) {
            return res.status(404).json({ error: "Exercice not found" }).end();
        }

        // Vérifiez si l'exercice_id existe dans la base de données
        ExerciceService.dao.getById(exercice_id)
            .then(exercice => {
                if (!exercice) {
                    return res.status(404).json({ error: "Exercice not found" }).end();
                }

                // Ajout de l'exercice en favori pour le User
                ExerciceService.dao.insertExoFavori(exercice_id, req.user.id)
                    .then(_ => res.status(200).end())
                    .catch(e => {
                        console.error(e);
                        res.status(500).end();
                    });
            })
            .catch(e => {
                console.error(e);
                res.status(500).end();
            });
    });

    app.delete("/exercice/favori", jwt.validateJWT, (req, res) => {
        const exercice_id = req.body['exercice_id'];
        if (exercice_id == null || exercice_id == undefined) {
            return res.status(404).json({ error: "Exercice not found" }).end();
        }

        // Vérifiez si l'exercice_id existe dans la base de données des favoris du User
        ExerciceService.dao.getByIdFavori(req.user.id, exercice_id)
            .then(exercice => {
                if (!exercice || (Array.isArray(exercice) && exercice.length === 0)) {
                    return res.status(404).json({ error: "Exercice not found" }).end();
                }

                // Suppression de l'exercice en favori pour le User
                ExerciceService.dao.deleteExoFavori(exercice_id, req.user.id)
                    .then(_ => res.status(200).end())
                    .catch(e => {
                        console.error(e);
                        res.status(500).end();
                    });
            })
            .catch(e => {
                console.error(e);
                res.status(500).end();
            });
    });
}