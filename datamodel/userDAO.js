const BaseDAO = require('./basedao')

module.exports = class UserDAO extends BaseDAO {
    constructor(db) {
        super(db, "Users")
    }

    getAllUser() {
        return new Promise((resolve, reject) =>
            this.db.query('SELECT * FROM Users ORDER BY id')
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    isValidUser(user) {
        user.login = user.login.trim()
        if (user.login === "") return false
        user.password = user.password.trim()
        if (user.password === "") return false
        return true
    }

    update(user) {
        return this.db.query("UPDATE Users SET login=$2,passWord=$3 WHERE id=$1",
            [user.id, user.login, user.challenge])
    }

    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM Users WHERE login=$1", [login])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }

    insertUser(user){
        return this.db.query(`INSERT INTO Users (login,challenge) VALUES  ('${user.login}','${user.challenge}')`)
    }

}