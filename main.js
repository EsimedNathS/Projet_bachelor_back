const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const ExerciceService = require("./services/exerciceService.js")
const UserService = require("./services/userService.js")

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

//const connectionString = "postgres://user:password@192.168.56.101/instance"
const connectionString = "postgres://user_tp_NodeJS:azerty@localhost/pg_projetBachelor"
const db = new pg.Pool({ connectionString: connectionString })

const exerciceService = new ExerciceService(db)
const userService = new UserService(db)
const jwt = require('./jwt')(userService)

require('./api/ExerciceAPI.js')(app, exerciceService)
require('./api/UserAPI.js')(app, userService, jwt)
require('./datamodel/seeder.js')(exerciceService, userService)
    .then(app.listen(3333))




