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
            this.db.query("SELECT * FROM Favori_exo WHERE IDUser = $1 ORDER BY id", [IDUser])
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

    insertExo(exercice){
        return this.db.query("INSERT INTO Exercice (name,description,groupe,type) VALUES  ($1,$2,$3,$4) RETURNING id", [exercice.name,exercice.description,exercice.groupe,exercice.type])
    }

    insertExoFavori(exercice_id, user_id){
        return this.db.query("INSERT INTO Favori_exo (IDUser, IDExo) VALUES  ($1,$2) RETURNING id", [user_id, exercice_id])
    }

    deleteExoFavori(exercice_id, user_id){
        return this.db.query("DELETE FROM Favori_exo WHERE IDExo=$1 AND IDUser=$2", [exercice_id, user_id])
    }

}