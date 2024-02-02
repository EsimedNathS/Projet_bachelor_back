const BaseDAO = require('./basedao')

module.exports = class ExerciceDAO extends BaseDAO {
    constructor(db) {
        super(db, "Exercice")
    }

    getAll() {
        return new Promise((resolve, reject) =>
            this.db.query('SELECT * FROM Exercice ORDER BY id')
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    isValid(exercice) {
        exercice.name = exercice.name.trim()
        if (exercice.name === "") return false
        exercice.description = exercice.description.trim()
        if (exercice.description === "") return false
        exercice.groupe = exercice.groupe.trim()
        if (exercice.groupe === "") return false
        exercice.type = exercice.type.trim()
        if (exercice.type === "") return false
        return true
    }

    update(exercice) {
        return this.db.query("UPDATE List SET shop=$2,date=$3,archived=$4 WHERE id=$1",
            [exercice.id, exercice.name, exercice.description, exercice.groupe, exercice.type])
    }

    insert(exercice){
        return this.db.query(`INSERT INTO Exercice (name,description,groupe,type) VALUES  ('${exercice.name}','${exercice.description}','${exercice.groupe}','${exercice.type}')`)
    }

}