const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config();

const ExerciceService = require("./services/exerciceService.js")
const ProgrammeService = require("./services/programmeService.js")
const UserService = require("./services/userService.js")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

//const connectionString = "postgres://user:password@192.168.56.101/instance"
const connectionString = process.env.CONNECTION_STRING
const port = process.env.PORT || 3333;
const db = new pg.Pool({ connectionString: connectionString })

const exerciceService = new ExerciceService(db)
const programmeService = new ProgrammeService(db)
const userService = new UserService(db)
const jwt = require('./jwt')(userService)

require('./api/ExerciceAPI.js')(app, exerciceService, jwt)
require('./api/ProgrammeAPI.js')(app, programmeService, exerciceService, jwt)
require('./api/UserAPI.js')(app, userService, jwt)
const seedDatabase = async () => require('./datamodel/seeder')(exerciceService, userService, programmeService )
if (require.main === module) {
    seedDatabase().then( () =>
        app.listen(port, () =>
            console.log(`Listening on the port ${port}`)
        )
    )
}
module.exports = { app, seedDatabase, userService }




