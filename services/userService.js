
const UserDAO = require("../datamodel/userDAO")
const User = require("../datamodel/user");
const bcrypt = require('bcrypt')

module.exports = class UserService {
    constructor(db) {
        this.dao = new UserDAO(db)
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }
    insert(user) {
        return this.dao.insert(new User(user.login, this.hashPassword(user.challenge)))
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }
    async validatePassword(login, password) {
        const user = await this.dao.getByLogin(login.trim())
        return this.comparePassword(password, user.challenge)
    }
}