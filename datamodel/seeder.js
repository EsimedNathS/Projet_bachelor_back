const User = require("./user.js");
const Exercice = require("./exercice.js");

module.exports = (ExerciceService, UserService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await ExerciceService.dao.db.query("CREATE TABLE Exercice(id SERIAL PRIMARY KEY, name TEXT, description TEXT, groupe TEXT, type TEXT)")
            await UserService.dao.db.query("CREATE TABLE Users(id SERIAL PRIMARY KEY, login TEXT, challenge TEXT)")

            // INSERT Users
            for (i=0; i < 5; i++){
                const randomLogin = "login" + i;
                const randomPassWord = "MDP"
                await UserService.insert(new User(randomLogin, randomPassWord) )
            }

            // INSERT Exercice
            await ExerciceService.dao.insert(new Exercice(  "Curl Biceps",
                                                            "Biceps, Possible avec des altères ou une poulie",
                                                            "Top",
                                                            "Isolation"
                                                          )
                                            )
            await ExerciceService.dao.insert(new Exercice(  "Squat",
                                                            "Quadriceps, Possible avec ou sans poids",
                                                            "Bottom",
                                                            "Polymusculaire"
                                                          )
                                             )
            await ExerciceService.dao.insert(new Exercice(  "Traction",
                                                            "Grand dorsal, Faire avec une barre en hauteur",
                                                            "Top",
                                                            "Polymusculaire"
                                                          )
                                            )
            await ExerciceService.dao.insert(new Exercice(  "Leg Extension",
                                                            "Quadriceps, Avec une machine",
                                                            "Bottom",
                                                            "Isolation"
                                                          )
                                            )
            await ExerciceService.dao.insert(new Exercice(  "Développer couché",
                                                            "Pec principalement et épaule",
                                                            "Top",
                                                            "Polymusculaire"
                                                          )
                                            )
            await ExerciceService.dao.insert(new Exercice(  "Développer militaire",
                                                            "Epaule, Barre ou altère",
                                                            "Top",
                                                            "Isolation"
                                                          )
                                            )
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
