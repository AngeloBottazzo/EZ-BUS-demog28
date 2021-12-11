const moment = require('moment');
const fs = require('fs')
const dbcredentials = JSON.parse(fs.readFileSync('db-credentials.json'))
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var CONNECTION_STRING = "mongodb+srv://" + dbcredentials.username + ":" + dbcredentials.password + "@cluster0.rrla8.mongodb.net/ezbusdev?retryWrites=true&w=majority"

var DATABASE = "ezbusdev";
var database;

const ferialefestivo = {
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true
}

const feriale = {
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false
}

MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, (error, client) => {
    database = client.db(DATABASE);
    console.log("Mongo DB Connection Successfull");

    database.collection("stazioni").insertMany([
        { _id: ObjectId('61ab9eb31e607d0f2cce7c58'), nome: 'Trento' },
        { _id: ObjectId('61ab9eb31e607d0f2cce7c59'), nome: 'Trento S. Chiara' },
        { _id: ObjectId('61ab9eb31e607d0f2cce7c5a'), nome: 'Trento S. Bartolameo' },
        { _id: ObjectId('61ab9f4a1e607d0f2cce7c5b'), nome: 'Villazano' },
        { _id: ObjectId('61ab9f671e607d0f2cce7c5c'), nome: 'Povo - Mesiano' },
        { _id: ObjectId('61ab9f831e607d0f2cce7c5d'), nome: 'Pergine Valsugana' },
        { _id: ObjectId('61ab9fa01e607d0f2cce7c5e'), nome: 'S. Cristoforo al L. I.' },
        { _id: ObjectId('61ab9fc01e607d0f2cce7c5f'), nome: 'Calceranica' },
        { _id: ObjectId('61ab9fda1e607d0f2cce7c60'), nome: 'Caldonazzo' },
        { _id: ObjectId('61ab9ff61e607d0f2cce7c61'), nome: 'Levico Terme' },
        { _id: ObjectId('61aba0311e607d0f2cce7c62'), nome: 'Roncegno B. M.' },
        { _id: ObjectId('61aba04c1e607d0f2cce7c63'), nome: 'Borgo Valsugana Centro' },
        { _id: ObjectId('61aba0611e607d0f2cce7c64'), nome: 'Borgo Valsugana Est' },
        { _id: ObjectId('61aba0761e607d0f2cce7c65'), nome: 'Strigno' },
        { _id: ObjectId('61aba08a1e607d0f2cce7c66'), nome: 'Grigno' },
        { _id: ObjectId('61aba0a21e607d0f2cce7c67'), nome: 'Tezze di Grigno' },
        { _id: ObjectId('61aba0b31e607d0f2cce7c68'), nome: 'Primolano' },
    ])

    let tratte = [
        //andata
        {
            nome_linea: "Trento – Primolano",
            fermate: [
                { stazione: '61ab9eb31e607d0f2cce7c58', minuti: 0 },
                { stazione: '61ab9eb31e607d0f2cce7c59', minuti: 9 },
                { stazione: '61ab9eb31e607d0f2cce7c5a', minuti: 2 },
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
                { ora: 05, minuti: 00, traffico: 1.0, posti: 5, giorni: feriale },
                { ora: 07, minuti: 30, traffico: 1.2, posti: 5, giorni: feriale },
                { ora: 08, minuti: 00, traffico: 1.4, posti: 5, giorni: ferialefestivo },
                { ora: 10, minuti: 00, traffico: 1.1, posti: 5, giorni: feriale },
                { ora: 11, minuti: 30, traffico: 1.1, posti: 5, giorni: feriale },
                { ora: 12, minuti: 45, traffico: 1.2, posti: 5, giorni: ferialefestivo },
                { ora: 15, minuti: 00, traffico: 1.1, posti: 5, giorni: feriale },
                { ora: 16, minuti: 30, traffico: 1.2, posti: 5, giorni: feriale },
                { ora: 17, minuti: 30, traffico: 1.4, posti: 5, giorni: feriale },
                { ora: 18, minuti: 30, traffico: 1.3, posti: 5, giorni: feriale },
                { ora: 19, minuti: 45, traffico: 1.1, posti: 5, giorni: ferialefestivo },
                { ora: 21, minuti: 30, traffico: 1.0, posti: 5, giorni: feriale },
            ]
        },

        //ritorno
        {
            nome_linea: "Primolano – Trento",
            fermate: [
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
                { stazione: '61ab9eb31e607d0f2cce7c5a', minuti: 2 },
                { stazione: '61ab9eb31e607d0f2cce7c59', minuti: 9 },
                { stazione: '61ab9eb31e607d0f2cce7c58', minuti: 0 },
            ], partenze: [
                { ora: 05, minuti: 00, traffico: 1.0, posti: 5, giorni: feriale },
                { ora: 07, minuti: 30, traffico: 1.2, posti: 5, giorni: feriale },
                { ora: 08, minuti: 00, traffico: 1.4, posti: 5, giorni: ferialefestivo },
                { ora: 10, minuti: 00, traffico: 1.1, posti: 5, giorni: feriale },
                { ora: 11, minuti: 30, traffico: 1.1, posti: 5, giorni: feriale },
                { ora: 12, minuti: 45, traffico: 1.2, posti: 5, giorni: ferialefestivo },
                { ora: 15, minuti: 00, traffico: 1.1, posti: 5, giorni: feriale },
                { ora: 16, minuti: 30, traffico: 1.2, posti: 5, giorni: feriale },
                { ora: 17, minuti: 30, traffico: 1.4, posti: 5, giorni: feriale },
                { ora: 18, minuti: 30, traffico: 1.3, posti: 5, giorni: feriale },
                { ora: 19, minuti: 45, traffico: 1.1, posti: 5, giorni: ferialefestivo },
                { ora: 21, minuti: 30, traffico: 1.0, posti: 5, giorni: feriale },
            ]
        },
    ]

    tratte.forEach(tratta => {

        tratta.partenze.forEach(partenza => {
            let distanzaCorrente = 0;
            let tempoCorrente = moment.duration({ hours: partenza.ora, minutes: partenza.minuti })
            database.collection("viaggi").insertOne({
                nome_linea: tratta.nome_linea,
                giorni: partenza.giorni,
                posti: partenza.posti,
                fermate: tratta.fermate.map(fermata => {
                    tempoCorrente = tempoCorrente.add(Math.floor(fermata.minuti * partenza.traffico), 'm');
                    distanzaCorrente += fermata.minuti;
                    return { stazione: ObjectId(fermata.stazione), ora: tempoCorrente.toJSON(), distanza: distanzaCorrente }
                })
            });
        });
    });

    console.log("fatto");
})