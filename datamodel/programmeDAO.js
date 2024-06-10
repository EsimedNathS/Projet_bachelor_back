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

    deleteAllProg(id_user) {
        return new Promise((resolve, reject) =>
            this.db.query('DELETE FROM Programme WHERE IDUser = $1', [id_user])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    patch(champ, value, id) {
        let query = "";
        const values = [value, id];

        switch(champ) {
            case "name":
                query = "UPDATE Programme SET name = $1 WHERE id = $2";
                break;
            case "favori":
                query = "UPDATE Programme SET favori = $1 WHERE id = $2";
                break;
            case "day":
                query = "UPDATE Programme SET day = $1 WHERE id = $2";
                break;
            default:
                throw new Error("Champ non autorisé");
        }

        // Exécutes la requête
        return this.db.query(query, values)
            .then(res => {
                return res;
            })
            .catch(error => {
                // Loggez l'erreur pour plus de détails
                console.error('Erreur SQL:', error);
                throw error; // Relancer l'erreur après logging
            });
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
            this.db.query("SELECT IDUser FROM Programme WHERE id=$1", [programme_id])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

}