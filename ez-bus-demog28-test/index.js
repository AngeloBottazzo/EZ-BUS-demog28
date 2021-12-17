var test = require('tape');
var request = require('supertest');
var app = require('../ez-bus-demog28-server/index');
const { assert } = require('console');

test('TEST1: scrivere cosa fa il test1',function (assert) {
    request(app)
        .post('/biglietti')
        .send({"stazione_partenza": "61ab9eb31e607d0f2cce7c58",
        "stazione_arrivo": "61aba0b31e607d0f2cce7c68",
        "viaggio": "61b3f64ece9723f367f3a842",
        "data_viaggio": "2021-12-23",
        "nome": "Gino",
        "cognome": "Pastino"})
        .end((err,res) => {
            if(err) {
                reject(new Error('An error occured with the employee Adding API, err: ' + err))
            }
        assert.error(err,'No error')
        assert.isEqual("Added Successfully", res.body, "Biglietto added correctly")
        assert.end();
        });
});