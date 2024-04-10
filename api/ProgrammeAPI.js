const Programme = require("../datamodel/programme");
module.exports = (app, ProgrammeService, ExerciceService, jwt) => {

    app.get("/programme", jwt.validateJWT, async (req, res) => {
        try {
            const allProg = await ProgrammeService.dao.getAllProg(req.user.id);

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
        if (!ProgrammeService.dao.isValidProg(programme))  {
            return res.status(400).end()
        }
        ProgrammeService.dao.insertProg(new Programme(programme.name,programme.day,programme.favori,programme.IDUser))
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
        console.log(req)
        ProgrammeService.dao.insertProgExo(programme_id, exercice_id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/programme/removeexercice", jwt.validateJWT, (req, res) => {
        const programme_id = req.body['programme_id']
        const exercice_id = req.body['exercice_id']
        console.log(req)
        ProgrammeService.dao.deleteProgExo(programme_id, exercice_id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.get("/programme/:id", (req, res) => {
        const programme_id = req.body['programme_id']
        console.log(req)
        ProgrammeService.dao.getProgExo(programme_id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.delete("/programme/:id", jwt.validateJWT, async (req, res) => {
        const programme_id = req.params.id
        console.log(req)
        ProgrammeService.dao.delete(programme_id)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.patch("/programme", jwt.validateJWT, async (req, res) => {
        const data_patch = req.body
        ProgrammeService.dao.patch(data_patch['champ_patch'], data_patch['value_patch'], data_patch['id_programme'])
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
        if ('day' in data_patch) {
            ProgrammeService.dao.verifyDay(data_patch['day'], req.user.id)
                .then( verifyResult => {
                    if (verifyResult.rows.length === 0){
                        ProgrammeService.dao.patch('day', data_patch['day'], data_patch['id_programme'])
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
    })

    app.put("/programme", async (req, res) => {
        const programme = req.body
        if ((programme.id === undefined) || (programme.id == null) || (!ProgrammeService.dao.isValidProg(programme))) {
            return res.status(400).end()
        }
        if (await ProgrammeService.dao.getById(programme.id) === undefined) {
            return res.status(404).end()
        }
        ProgrammeService.dao.update(programme)
            .then(_ => res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

}