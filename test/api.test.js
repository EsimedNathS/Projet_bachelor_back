const chai = require('chai')
const chaiHttp = require('chai-http');
const { app, seedDatabase, userService} = require("../main");
const {expect} = require("chai");
const User = require("../datamodel/user");
const Programme = require("../datamodel/programme");
const should = chai.should();

chai.use(chaiHttp);

describe('API Tests', function() {
    this.timeout(5000);
    let token = '';

    // Connexion à l'API pour récupérer le token JWT
    before( (done) => {
        seedDatabase().then( async () => {
            console.log("Creating test user");
            userService.insertUser(new User('user1', 'default')).then( () =>
                chai.request(app)
                    .post('/user/authenticate')
                    .send({login: 'user1', password: 'default'})
                    .end((err, res) => {
                        res.should.have.status(200);
                        token = res.body.token;
                        done();
                    })
            )})
    });

    // Suppression de l'utilisateur utilisé à la fin des tests
    after( (done) => {
        console.log("Deleting test user")
        userService.dao.deleteUser('user1','default').then(done())
    })

    // Test avec un token JWT valide
    it('should allow access with valid token', (done) => {
        chai.request(app)
            .get('/exercice')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array'); // TODO : remplacer array par object si votre route retourne un objet
                res.body.length.should.be.at.least(5);
                done();
            });
    });

    // Test avec un token JWT non valide
    it('should deny access with invalid token', (done) => {
        chai.request(app)
            .get('/exercice')
            .set('Authorization', 'Bearer wrongtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });


    // Tests insertion de données
    it('should insert a Favori exercice', (done) => {
        chai.request(app)
            .post('/exercice/favori')
            .set('Authorization', `Bearer ${token}`)
            .send({exercice_id: "1"})
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    it('should not insert a Favori exercice (invalid id)', (done) => {
        chai.request(app)
            .post('/exercice/favori')
            .set('Authorization', `Bearer ${token}`)
            .send({exercice_id: "100"})
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it('should not insert a Favori exercice (no id)', (done) => {
        chai.request(app)
            .post('/exercice/favori')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    // Test récupération de données
    it('should return an array', (done) => {
        chai.request(app)
            .get('/exercice/favori')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
    it('should not return a favori (invald token)', (done) => {
        chai.request(app)
            .get('/exercice/favori')
            .set('Authorization', `Bearer wrongtoken`)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    //Test suppression de données
    it('should not delete a Favori exercice (invalid id)', (done) => {
        chai.request(app)
            .delete('/exercice/favori')
            .set('Authorization', `Bearer ${token}`)
            .send({exercice_id: "100"})
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it('should not delete a Favori exercice (no id)', (done) => {
        chai.request(app)
            .delete('/exercice/favori')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    it('should delete a Favori exercice', (done) => {
        chai.request(app)
            .delete('/exercice/favori')
            .set('Authorization', `Bearer ${token}`)
            .send({exercice_id: "1"})
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });






});