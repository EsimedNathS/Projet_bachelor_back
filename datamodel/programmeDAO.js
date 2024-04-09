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

    isValidProg(programme) {
        programme.name = programme.name.trim()
        if (programme.name === "") return false
        if (typeof programme.favori !== 'boolean') return false
        if (!/^\d+$/.test(programme.IDUser)) return false
        return true
    }

    update(programme) {
        return this.db.query("UPDATE List SET shop=$2,date=$3,archived=$4 WHERE id=$1",
            [programme.id, programme.name, programme.day, programme.favori, programme.IDUser])
    }

    patch(champ, value, id){
        return this.db.query(`UPDATE Programme SET ${champ}=$1 WHERE id=$2`,
            [value, id])
    }

    insertProg(programme){
        return this.db.query(`INSERT INTO Programme (name,day,favori,IDUser) VALUES  ('${programme.name}','${programme.day}','${programme.favori}','${programme.IDUser}') RETURNING id`)
    }

    insertProgExo(programme_id, exercice_id){
        return this.db.query(`INSERT INTO ProgExo (IDProg, IDExo) VALUES  ('${programme_id}','${exercice_id}')`)
    }

    deleteProgExo(programme_id, exercice_id){
        return this.db.query("DELETE FROM ProgExo WHERE IDProg=$1 AND IDExo=$2",
            [programme_id, exercice_id])
    }

    getProgExo(programme_id){
        return this.db.query(`SELECT * FROM ProgExo WHERE IDProg = '${programme_id}'`)
    }

    verifyDay(day, IDUser){
        return this.db.query(`SELECT * FROM Programme WHERE day = '${day}' AND IDUser = '${IDUser}'`)
    }

}