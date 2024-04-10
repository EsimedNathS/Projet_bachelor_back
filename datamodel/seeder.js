const User = require("./user.js");
const Exercice = require("./exercice.js");
const Programme = require("./programme.js");

module.exports = (ExerciceService, UserService, ProgrammeService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await ExerciceService.dao.db.query("CREATE TABLE Exercice(id SERIAL PRIMARY KEY, name TEXT, description TEXT, groupe TEXT, type TEXT)")
            await ExerciceService.dao.db.query("CREATE TABLE Favori_exo(id SERIAL PRIMARY KEY, IDExo INT, IDUser INT)")
            await ProgrammeService.dao.db.query("CREATE TABLE Programme(id SERIAL PRIMARY KEY, name TEXT, day TEXT, favori BOOL, IDUser INT)")
            await ProgrammeService.dao.db.query("CREATE TABLE ProgExo(id SERIAL PRIMARY KEY, IDExo INT, IDProg INT)")
            await UserService.dao.db.query("CREATE TABLE Users(id SERIAL PRIMARY KEY, login TEXT, challenge TEXT)")

            // INSERT Users
            for (i=0; i < 5; i++){
                const randomLogin = "login" + i;
                const randomPassWord = "MDP"
                await UserService.insertUser(new User(randomLogin, randomPassWord) )
            }


            // INSERT Exercice
            await ExerciceService.dao.insertExo(new Exercice(  "Curl Biceps",
                                                                "Biceps, Possible avec des altères ou une poulie",
                                                                "Top",
                                                                "Isolation"
                                                            )
                                                )
            await ExerciceService.dao.insertExo(new Exercice(  "Squat",
                                                                "Quadriceps, Possible avec ou sans poids",
                                                                "Bottom",
                                                                "Polymusculaire"
                                                            )
                                                )
            await ExerciceService.dao.insertExo(new Exercice(  "Traction",
                                                                "Grand dorsal, Faire avec une barre en hauteur",
                                                                "Top",
                                                                "Polymusculaire"
                                                            )
                                                )
            await ExerciceService.dao.insertExo(new Exercice(  "Leg Extension",
                                                                "Quadriceps, Avec une machine",
                                                                "Bottom",
                                                                "Isolation"
                                                            )
                                                )
            await ExerciceService.dao.insertExo(new Exercice(  "Développer couché",
                                                                "Pec principalement et épaule",
                                                                "Top",
                                                                "Polymusculaire"
                                                            )
                                            )
            var exo_test = new Exercice(  "Développer militaire",
                                                   "Epaule, Barre ou altère",
                                                   "Top",
                                                   "Isolation"
                                                )
            var res = await ExerciceService.dao.insertExo(exo_test);
            var exercice_id = res.rows[0].id;



            // INSERT Programme
            var prog_test = new Programme( "Test de nom",
                                                    "Lundi",
                                                    "false",
                                                    "4"
                                                  )
            var res = await ProgrammeService.dao.insertProg(prog_test);
            var programme_id = res.rows[0].id;

            // INSERT ProgExo
            await ProgrammeService.dao.insertProgExo(programme_id, exercice_id)


        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }
    })
}
