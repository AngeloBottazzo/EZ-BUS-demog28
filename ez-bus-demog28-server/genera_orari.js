const moment = require('moment');
const fs = require('fs')
const dbcredentials = JSON.parse(fs.readFileSync('db-credentials.json'))
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var CONNECTION_STRING = "mongodb+srv://" + dbcredentials.username + ":" + dbcredentials.password + "@cluster0.rrla8.mongodb.net/ezbusdev?retryWrites=true&w=majority"

var DATABASE = "ezbusdev";
var database;

MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, (error, client) => {
    database = client.db(DATABASE);
    console.log("Mongo DB Connection Successfull");

    let viaggi = [
        //andata
        {
            nome_linea: "Trento – Primolano",
            sfasamenti: [
                { stazione: '61ab9a5fe757bd5f92b4e9ba', minuti: 0 },
                { stazione: '61ab9a6be757bd5f92b4e9bb', minuti: 9 },
                { stazione: '61ab9eb31e607d0f2cce7c58', minuti: 2 },
                { stazione: '61ab9f4a1e607d0f2cce7c5b', minuti: 2 },
                { stazione: '61ab9f671e607d0f2cce7c5c', minuti: 6 },
                { stazione: '61ab9f831e607d0f2cce7c5d', minuti: 10 },
                { stazione: '61ab9fa01e607d0f2cce7c5e', minuti: 6 },
                { stazione: '61ab9fc01e607d0f2cce7c5f', minuti: 5 },
                { stazione: '61ab9fda1e607d0f2cce7c60', minuti: 4 },
                { stazione: '61ab9ff61e607d0f2cce7c61', minuti: 7 },
                { stazione: '61aba0311e607d0f2cce7c62', minuti: 10 },
                { stazione: '61aba04c1e607d0f2cce7c63', minuti: 7 },
                { stazione: '61aba0611e607d0f2cce7c64', minuti: 1 },
                { stazione: '61aba0761e607d0f2cce7c65', minuti: 6 },
                { stazione: '61aba08a1e607d0f2cce7c66', minuti: 11 },
                { stazione: '61aba0a21e607d0f2cce7c67', minuti: 6 },
                { stazione: '61aba0b31e607d0f2cce7c68', minuti: 4 },
            ], partenze: [
                { ora: 05, minuti: 00, traffico: 1.0, giorni: [true, true, true, true, true, false, false] },
                { ora: 07, minuti: 30, traffico: 1.2, giorni: [true, true, true, true, true, false, false] },
                { ora: 08, minuti: 00, traffico: 1.4, giorni: [true, true, true, true, true, true, true] },
                { ora: 10, minuti: 00, traffico: 1.1, giorni: [true, true, true, true, true, false, false] },
                { ora: 11, minuti: 30, traffico: 1.1, giorni: [true, true, true, true, true, false, false] },
                { ora: 12, minuti: 45, traffico: 1.2, giorni: [true, true, true, true, true, true, true] },
                { ora: 15, minuti: 00, traffico: 1.1, giorni: [true, true, true, true, true, false, false] },
                { ora: 16, minuti: 30, traffico: 1.2, giorni: [true, true, true, true, true, false, false] },
                { ora: 17, minuti: 30, traffico: 1.4, giorni: [true, true, true, true, true, false, false] },
                { ora: 18, minuti: 30, traffico: 1.3, giorni: [true, true, true, true, true, false, false] },
                { ora: 19, minuti: 45, traffico: 1.1, giorni: [true, true, true, true, true, true, true] },
                { ora: 21, minuti: 30, traffico: 1.0, giorni: [true, true, true, true, true, false, false] },
            ]
        },

        //ritorno
        {
            nome_linea: "Primolano – Trento",
            sfasamenti: [
                { stazione: '61aba0b31e607d0f2cce7c68', minuti: 0 },
                { stazione: '61aba0a21e607d0f2cce7c67', minuti: 6 },
                { stazione: '61aba08a1e607d0f2cce7c66', minuti: 10 },
                { stazione: '61aba0761e607d0f2cce7c65', minuti: 5 },
                { stazione: '61aba0611e607d0f2cce7c64', minuti: 6 },
                { stazione: '61aba04c1e607d0f2cce7c63', minuti: 9 },
                { stazione: '61aba0311e607d0f2cce7c62', minuti: 6 },
                { stazione: '61ab9ff61e607d0f2cce7c61', minuti: 3 },
                { stazione: '61ab9fda1e607d0f2cce7c60', minuti: 4 },
                { stazione: '61ab9fc01e607d0f2cce7c5f', minuti: 5 },
                { stazione: '61ab9fa01e607d0f2cce7c5e', minuti: 6 },
                { stazione: '61ab9f831e607d0f2cce7c5d', minuti: 9 },
                { stazione: '61ab9f671e607d0f2cce7c5c', minuti: 5 },
                { stazione: '61ab9f4a1e607d0f2cce7c5b', minuti: 1 },
                { stazione: '61ab9eb31e607d0f2cce7c58', minuti: 2 },
                { stazione: '61ab9a6be757bd5f92b4e9bb', minuti: 9 },
                { stazione: '61ab9a5fe757bd5f92b4e9ba', minuti: 0 },
            ], partenze: [
                { ora: 05, minuti: 00, traffico: 1.0, giorni: [true, true, true, true, true, false, false] },
                { ora: 07, minuti: 30, traffico: 1.2, giorni: [true, true, true, true, true, false, false] },
                { ora: 08, minuti: 00, traffico: 1.4, giorni: [true, true, true, true, true, true, true] },
                { ora: 10, minuti: 00, traffico: 1.1, giorni: [true, true, true, true, true, false, false] },
                { ora: 11, minuti: 30, traffico: 1.1, giorni: [true, true, true, true, true, false, false] },
                { ora: 12, minuti: 45, traffico: 1.2, giorni: [true, true, true, true, true, true, true] },
                { ora: 15, minuti: 00, traffico: 1.1, giorni: [true, true, true, true, true, false, false] },
                { ora: 16, minuti: 30, traffico: 1.2, giorni: [true, true, true, true, true, false, false] },
                { ora: 17, minuti: 30, traffico: 1.4, giorni: [true, true, true, true, true, false, false] },
                { ora: 18, minuti: 30, traffico: 1.3, giorni: [true, true, true, true, true, false, false] },
                { ora: 19, minuti: 45, traffico: 1.1, giorni: [true, true, true, true, true, true, true] },
                { ora: 21, minuti: 30, traffico: 1.0, giorni: [true, true, true, true, true, false, false] },
            ]
        },
    ]

    viaggi.forEach(viaggio => {

        viaggio.partenze.forEach(partenza => {

            let tempoCorrente = moment.duration({ hours: partenza.ora, minutes: partenza.minuti })
            database.collection("viaggi").insertOne({
                nome_linea: viaggio.nome_linea,
                giorni: partenza.giorni,
                stazioni: viaggio.sfasamenti.map(sfasamento => {
                    tempoCorrente = tempoCorrente.add(Math.floor(sfasamento.minuti * partenza.traffico), 'm');
                    return { stazione: ObjectId(sfasamento.stazione), ora: tempoCorrente.toJSON() }
                })
            });
        });
    });

    console.log("fatto");
})