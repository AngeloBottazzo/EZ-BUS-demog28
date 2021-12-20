var test = require('tape');
var request = require('supertest');
var app = require('../ez-bus-demog28-server/index');

test('TEST1: inserimento corretto di un biglietto dentro la collezione di biglietti',function (assert) {
    request(app)
        .post('app/biglietti')
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
            /*
            if (err) {
                console.log(new Error('An error occured with the biglietto adding API, err: ' + err))
            }
            */
            assert.error(err,'No error');
            assert.end();
        })
});