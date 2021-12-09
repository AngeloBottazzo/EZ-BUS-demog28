const fs = require('fs');
var Express = require("express");
var bodyParser = require("body-parser");

var app = Express();

var cors = require('cors')
app.use(cors())

const dbcredentials = JSON.parse(fs.readFileSync('db-credentials.json'));

var MongoClient = require("mongodb").MongoClient;
var CONNECTION_STRING = "mongodb+srv://"+dbcredentials.username+":"+dbcredentials.password+"@cluster0.rrla8.mongodb.net/ezbusdev?retryWrites=true&w=majority"

var DATABASE = "ezbusdev";
var database;

app.listen(8081, ()=>{
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, (error, client) => {
        database = client.db(DATABASE);
        console.log("Mongo DB Connection Successfull");
    })

    console.log("server running");
});

app.get('/', (request, response)=>{
    response.send('Home');
})

app.get('/stazioni', (request, response)=>{
    
    database.collection("stazioni").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }

        response.send(result);
    })
})

app.post('/biglietti', (request, response)=>{
    database.collection("biglietti_acquistati").insertOne({
        nome : request.body['name'],
        cognome : request.body['cognome'],
        telefono : request.body['telefono'],
        data_nascita : request.body['data_nascita'],
        stazione_partenza : request.body['stazione_partenza'],
        stazione_arrivo : request.body['stazione_arrivo'],
        data_partenza : request.body['data_partenza'],
        data_arrivo : request.body['data_arrivo'],
    });
    response.statusCode(200);
})


app.get('/cose/:numero', (request, response)=>{
    response.send('parameter example ' + response.params.numero);
})