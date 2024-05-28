const ProgrammeDAO = require("../datamodel/programmeDAO");

module.exports = class ProgrammeService {
    constructor(db) {
        this.dao = new ProgrammeDAO(db)
    }

    isValidProg(programme) {
        programme.name = programme.name.trim()
        if (programme.name === "") return false
        if (typeof programme.favori !== 'boolean') return false
        if (!/^\d+$/.test(programme.IDUser)) return false
        return true
    }

    async isValidUserProgramme(programme_id, user_id) {
        var result = await this.dao.verifyIDUser(programme_id)
        if (result['iduser'] == user_id) {
            return true
        } else {
            return false
        }
    }
}