const BaseDAO = require('./basedao')

module.exports = class ProgrammeDAO extends BaseDAO {
    constructor(db) {
        super(db, "Programme")
    }

    getAllProg(id_user) {
        return new Promise((resolve, reject) =>
            this.db.query('SELECT * FROM Programme WHERE IDUser = $1 ORDER BY id', [id_user])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    patch(champ, value, id){
        return this.db.query("UPDATE Programme SET ${champ}=$1 WHERE id=$2", [value, id])
    }

    insertProg(programme){
        return this.db.query("INSERT INTO Programme (name, day, favori, IDUser) VALUES ($1, $2, $3, $4) RETURNING id",
            [programme.name, programme.day, programme.favori, programme.IDUser]);
    }

    insertProgExo(programme_id, exercice_id){
        return this.db.query("INSERT INTO ProgExo (IDProg, IDExo) VALUES  ($1,$2)", [programme_id, exercice_id])
    }

    deleteProgExo(programme_id, exercice_id){
        return this.db.query("DELETE FROM ProgExo WHERE IDProg=$1 AND IDExo=$2", [programme_id, exercice_id])
    }

    verifyDay(day, IDUser){
        return this.db.query("SELECT * FROM Programme WHERE day=$1 AND IDUser=$2", [day, IDUser])
    }

    verifyIDUser(programme_id){
        return new Promise((resolve, reject) =>
            this.db.query(this.db.query("SELECT IDUser FROM Programme WHERE id=$1", [programme_id]))
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

}