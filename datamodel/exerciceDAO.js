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

    getAllFavori(IDUser) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM Favori_exo WHERE IDUser = '${IDUser}' ORDER BY id`)
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    getAllByProgramme(id_programme) {
        return new Promise((resolve, reject) =>
            this.db.query('SELECT Exercice.* FROM Exercice, ProgExo ' +
                ' WHERE Exercice.id = IDExo' +
                ' AND IDProg = $1' +
                ' ORDER BY id', [id_programme])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    isValidExo(exercice) {
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
        return this.db.query("UPDATE List SET name=$2,description=$3,groupe=$4,type=$5 WHERE id=$1",
            [exercice.id, exercice.name, exercice.description, exercice.groupe, exercice.type])
    }

    insertExo(exercice){
        return this.db.query(`INSERT INTO Exercice (name,description,groupe,type) VALUES  ('${exercice.name}','${exercice.description}','${exercice.groupe}','${exercice.type}') RETURNING id`)
    }

    insertExoFavori(exercice_id, user_id){
        return this.db.query(`INSERT INTO Favori_exo (IDUser, IDExo) VALUES  ('${user_id}','${exercice_id}') RETURNING id`)
    }

}