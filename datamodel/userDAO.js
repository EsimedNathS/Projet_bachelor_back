const BaseDAO = require('./basedao')

module.exports = class UserDAO extends BaseDAO {
    constructor(db) {
        super(db, "Users")
    }

    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM Users WHERE login=$1", [login])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    insertUser(user){
        return this.db.query("INSERT INTO Users (login,challenge) VALUES  ($1,$2)", [user.login, user.challenge])
    }

    deleteUser(Login, challenge){
        return this.db.query("DELETE FROM Users WHERE Login=$1 AND challenge=$1", [Login, challenge])
    }

}