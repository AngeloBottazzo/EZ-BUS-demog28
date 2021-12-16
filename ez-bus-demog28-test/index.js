var test = require('tape');
var request = require('supertest');
var app = require('../ez-bus-demog28-server/index');

test('TEST1: scrivere cosa fa il test1',function (assert) {
    request(app);
        //.tipo('directory')
        //.expect('valore di ritorno', /json/)
        //.expect(valore di status) #es. 200
        /*.end(function (err, res) { #esempio funzione prof
            console.log(res.body.length);
            var NumOfEmployees = res.body.length;
            var result = false;
            if (NumOfEmployees == 0) {
                result = true;
            }

            assert.error(err, 'No error');
            assert.notEqual(true, result, 'Employees retrieved Correctly');
            assert.end();
        });
        */
});

//altri test in base alle API fatte (il prof ne fa 3)