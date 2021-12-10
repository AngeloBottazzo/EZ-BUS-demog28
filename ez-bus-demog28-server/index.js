const fs = require('fs');
var Express = require("express");
const moment = require('moment');

var app = Express();

// modules to generate APIs documentation
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'EZ-BUS',
            version: '1.0.0',
            description:
                'Queste sono API per la gestione dei biglietti.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Group28',
                url: 'http://localhost:8081',
            },
        },
        servers: [
            {
                url: 'http://localhost:8081/',
                description: 'Development server',
            },
        ],
    },
    apis: ["index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(Express.json());

var cors = require('cors')
app.use(cors())

const dbcredentials = JSON.parse(fs.readFileSync('db-credentials.json'));

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const { resourceUsage } = require('process');
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

/**
 * @swagger
 * /:
 *  get:
 *   summary: Home page della gestione biglietti
 *   description: home page contenente due pulsanti per scegliere l'azione da svolgere
 *   responses:
 *    200:
 *      description: bottone1 -> Acquista nuovo biglietto, bottone2 -> Acquista nuovo biglietto.
 */

app.get('/', (request, response)=>{
    response.send('Home');
})

/**
 * @swagger
 * /stazioni:
 *  get:
 *   summary: Lista delle stazioni
 *   description: vengono mostrate tutte le stazioni all'interno del database
 *   responses:
 *    200:
 *     description: Una lista di stazione.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         data:
 *          type: array
 *          items:
 *           type: object
 *           properties:
 *            _id:
 *             type: string
 *             description: ID della stazione
 *             example: 61ab9a5fe757bd523db4e9ba 
 *            name: 
 *             type: string
 *             description: Nome della stazione
 *             example: Strigno
 */
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
        nome : request.body.nome,
        cognome : request.body.cognome,
        telefono : request.body['telefono'],
        data_nascita : moment(request.body['data_nascita']).format("YYYY-MM-DD"),
        viaggio : ObjectId(request.body['viaggio']),
        data_viaggio : moment(request.body['data_viaggio']).format("YYYY-MM-DD"),
        stazione_partenza : ObjectId(request.body['stazione_partenza']),
        stazione_arrivo : ObjectId(request.body['stazione_arrivo'])
    });
    response.sendStatus(200);
})

function trovaFermataInViaggio(viaggio, stazione){
    return viaggio.stazioni.find(fermata=>{
        return fermata.stazione.toString() == stazione.toString()
    })
}

app.get('/biglietti', (request, response)=>{
    database.collection("biglietti_acquistati").aggregate(
        [
            {
                $lookup: {
                    from: 'viaggi',
                    localField: 'viaggio',
                    foreignField: '_id',
                    as: 'info_viaggio'

                }
            },
            {
                $lookup: {
                    from: 'stazioni',
                    localField: 'stazione_partenza',
                    foreignField: '_id',
                    as: 'info_stazione_partenza'

                }
            },
            {
                $lookup: {
                    from: 'stazioni',
                    localField: 'stazione_arrivo',
                    foreignField: '_id',
                    as: 'info_stazione_arrivo'

                }
            },
            {
                $unwind: "$info_viaggio",
            },
            {
                $unwind: "$info_stazione_partenza",
            },
            {
                $unwind: "$info_stazione_arrivo",
            }
                
        ]).toArray((error, result) => {
                if (error) {
            console.log(error);
        }

        let info_espanse = result.map((biglietto)=>{
            let fermata_partenza = trovaFermataInViaggio(biglietto.info_viaggio, biglietto.stazione_partenza)
            let fermata_arrivo = trovaFermataInViaggio(biglietto.info_viaggio, biglietto.stazione_arrivo)
            return {...biglietto,
                data_partenza : moment(biglietto.data_viaggio).add(moment.duration(fermata_partenza.ora)),
                data_arrivo : moment(biglietto.data_viaggio).add(moment.duration(fermata_arrivo.ora)),
            }
        })


        response.send(info_espanse);
    })
})


app.get('/viaggi-tra-stazioni', (request, response)=>{
    if(!('stazione_partenza' in request.query) || !('stazione_arrivo' in request.query) || !('data_viaggio' in request.query))
    {
        response.sendStatus(400);
        return;
    }
    
    potenzialiViaggi = database.collection("viaggi").find({}).toArray((error, potenzialiViaggi) => {
        if (error) {
            console.log(error);
            response.sendStatus(500);
        }

        response.send(
            potenzialiViaggi.filter(viaggio => 
                viaggio.stazioni.findIndex((fermata=>fermata.stazione == request.query.stazione_partenza)) < viaggio.stazioni.findIndex((fermata=>fermata.stazione == request.query.stazione_arrivo)))
        )
    })

})