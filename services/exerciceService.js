const ExerciceDAO = require("../datamodel/exerciceDAO");

module.exports = class ExerciceService {
    constructor(db) {
        this.dao = new ExerciceDAO(db)
    }
}