const Programme = require("../datamodel/programme");
module.exports = (app, ProgrammeService, ExerciceService, jwt) => {

    app.get("/programme", jwt.validateJWT, async (req, res) => {
        try {
            const allProg = await ProgrammeService.dao.getAllProg(req.user.id);
            //Récupération des exercices des programmes
            for (const elementProg of allProg) {
                try {
                    elementProg.exercice = await ExerciceService.dao.getAllByProgramme(elementProg.id);
                } catch (error) {
                    console.error('Erreur lors de la récupération des exercices pour le programme', elementProg.id, ':', error);
                    throw error;
                }
            }
            console.log(allProg);
            res.json(allProg);
        } catch (error) {
            console.error('Erreur lors de la récupération des programmes :', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des programmes' });
        }
    });

    app.post("/programme", jwt.validateJWT, (req, res) => {
        const programme = req.body
        console.log(req)
        // Vérification validité du programme
        if (!ProgrammeService.isValidProg(programme))  {
            return res.status(400).end()
        }
        // Insertion du programme en db
        ProgrammeService.dao.insertProg(new Programme(programme.name,programme.day,programme.favori,req.user.id))
            .then(insertionResult => {
                res.status(200).json({id: insertionResult.rows[0].id});
            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.post("/programme/addexercice", jwt.validateJWT, (req, res) => {
        const programme_id = req.body['programme_id']
        const exercice_id = req.body['exercice_id']
        // Vérification du User
        ProgrammeService.isValidUser(programme_id, req.user.id)
            .then( verifyResult => {
                    if (verifyResult){
                        // Ajout de l'exerice au programme
                        ProgrammeService.dao.insertProgExo(programme_id, exercice_id)
                            .then(_ => res.status(200).end())
                            .catch(e => {
                                console.log(e)
                                res.status(500).end()
                            })
                    } else {
                        return res.status(403).end()
                        //TODO gérer le front dans ce cas
                    }
                }
            )
    })

    app.delete("/programme/removeexercice", jwt.validateJWT, (req, res) => {
        const programme_id = req.body['programme_id']
        const exercice_id = req.body['exercice_id']
        // Vérification du User
        ProgrammeService.isValidUser(programme_id, req.user.id)
            .then( verifyResult => {
                    if (verifyResult){
                        // Enlève l'exerice du programme
                        ProgrammeService.dao.deleteProgExo(programme_id, exercice_id)
                            .then(_ => res.status(200).end())
                            .catch(e => {
                                console.log(e)
                                res.status(500).end()
                            })
                    } else {
                        return res.status(403).end()
                        //TODO gérer le front dans ce cas
                    }
                }
            )
    })

    app.delete("/programme/:id", jwt.validateJWT, async (req, res) => {
        const programme_id = req.params.id
        // Vérification du User
        ProgrammeService.isValidUser(programme_id, req.user.id)
            .then( verifyResult => {
                    if (verifyResult){
                        // Supprime le programme
                        ProgrammeService.dao.delete(programme_id)
                            .then(_ => res.status(200).end())
                            .catch(e => {
                                console.log(e)
                                res.status(500).end()
                            })
                    } else {
                        return res.status(403).end()
                        //TODO gérer le front dans ce cas
                    }
                }
            )
    })

    app.patch("/programme", jwt.validateJWT, async (req, res) => {
        const data_patch = req.body
        // Cas de changement de jour du programme
        if (data_patch['champ_patch'] == 'day') {
            // Vérifie que le jour n'est pas déjà pris
            ProgrammeService.dao.verifyDay(data_patch['value_patch'], req.user.id)
                .then( verifyResult => {
                    if (verifyResult.rows.length === 0 || data_patch['value_patch'] == 'null'){
                        // Changement de la valeur voulue
                        ProgrammeService.dao.patch(data_patch['champ_patch'], data_patch['value_patch'], data_patch['id_programme'])
                            .then(_ => res.status(200).end())
                            .catch(e => {
                                console.log(e)
                                res.status(500).end()
                            })
                    } else {
                        return res.status(403).end()
                    }
                }
            )
        }
        else {
            // Vérification du User
            ProgrammeService.isValidUserProgramme(data_patch['id_programme'], req.user.id)
                .then( verifyResult => {
                        if (verifyResult){
                            // Changement de la valeur voulue
                            ProgrammeService.dao.patch(data_patch['champ_patch'], data_patch['value_patch'], data_patch['id_programme'])
                                .then(_ => res.status(200).end())
                                .catch(e => {
                                    console.log(e)
                                    res.status(500).end()
                                })
                        } else {
                            return res.status(403).end()
                            //TODO gérer le front dans ce cas
                        }
                    }
                )
        }
    })
}