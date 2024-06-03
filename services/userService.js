
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
    insertUser(user) {
        return this.dao.insertUser(new User(user.login, this.hashPassword(user.challenge)))
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }
    async validatePassword(login, password) {
        const user = await this.dao.getByLogin(login.trim())
        if (this.comparePassword(password, user.challenge)){
            return user;
        }
        else {
            return false;
        }
    }

    isValidUser(user) {
        user.login = user.login.trim()
        if (user.login === "") return false
        user.password = user.password.trim()
        if (user.password === "") return false
        return true
    }

    isValidLogin(login) {
        return this.dao.getByLogin(login.trim())
            .then(user => {
                if (user != null) {
                    return false
                } else {
                    return true
                }
            })
    }
}