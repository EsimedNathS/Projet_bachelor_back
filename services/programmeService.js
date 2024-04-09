const ProgrammeDAO = require("../datamodel/programmeDAO");

module.exports = class ProgrammeService {
    constructor(db) {
        this.dao = new ProgrammeDAO(db)
    }
}