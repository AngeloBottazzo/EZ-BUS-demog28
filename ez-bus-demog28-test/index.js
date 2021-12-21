var test = require('tape');
var request = require('supertest');
var server = require('../ez-bus-demog28-server/index')

server.connettiDatabaseEPrendiApp().then((app)=>{
    
    test('TEST 1: reperimento delle stazioni',function (assert) {
        request(app)
            .get('/stazioni')
            .expect(200)
            .end((err,res) => {
                assert.true(res.body.length > 0, 'Nessuna stazione ricevuta')
                assert.error(err,'No error');
                assert.end();
            })
    });

    test('TEST 2: inserimento corretto di un biglietto dentro la collezione di biglietti',function (assert) {
        request(app)
            .post('/biglietti')
            .send({
                "stazione_partenza": "61ab9eb31e607d0f2cce7c58",
                "stazione_arrivo": "61aba0b31e607d0f2cce7c68",
                "viaggio": "61b3f64ece9723f367f3a842",
                "data_viaggio": "2021-12-23",
                "nome": "Gino",
                "cognome": "Pastino"
            })
            .expect(200)
            .end((err,res) => {
                if (err) {
                    console.log(new Error('An error occured with the biglietto adding API, err: ' + err))
                }
                assert.error(err,'No error');
                assert.end();
            })
    });
    
    test('TEST 3: inserimento incorretto (manca la stazione di arrivo) di un biglietto dentro la collezione di biglietti',function (assert) {
        request(app)
            .post('/biglietti')
            .send({
                "stazione_partenza": "61ab9eb31e607d0f2cce7c58",
                "stazione_arrivo": "",
                "viaggio": "61b3f64ece9723f367f3a842",
                "data_viaggio": "2021-12-23",
                "nome": "Gino",
                "cognome": "Pastino"
            })
            .expect(400)
            .end((err,res) => {
                if (err) {
                    console.log(new Error('An error occured with the biglietto adding API, err: ' + err))
                }
                assert.error(err,'No error');
                assert.end();
            })
    });

    test('TEST 4: reperimento dei biglietti precedentemente acquistati',function (assert) {
        request(app)
            .get('/biglietti')
            .expect(200)
            .end((err,res) => {
                assert.true(res.body.length > 0, 'Nessun biglietto ricevuto')
                assert.error(err,'No error');
                assert.end();
            })
    });
})