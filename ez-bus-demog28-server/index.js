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
app.use(Express.urlencoded({ extended: true }));

var cors = require('cors')
app.use(cors())

const dbcredentials = JSON.parse(fs.readFileSync('db-credentials.json'));

var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const { urlencoded } = require('express');
var CONNECTION_STRING = "mongodb+srv://" + dbcredentials.username + ":" + dbcredentials.password + "@cluster0.rrla8.mongodb.net/ezbusdev?retryWrites=true&w=majority"

var DATABASE = "ezbusdev";
var database;

app.listen(8081, () => {
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
 *         stazione:
 *          type: array
 *          items:
 *           type: object
 *           properties:
 *            _id:
 *             type: ObjectId
 *             description: ID della stazione
 *             example: 61ab9a5fe757bd523db4e9ba 
 *            name: 
 *             type: string
 *             description: Nome della stazione
 *             example: Strigno
 */
app.get('/stazioni', (request, response) => {
    
    database.collection("stazioni").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }

        response.send(result);
    })
})
/**
 * @swagger
 *  /biglietti:
 *   post:
 *    requestBody:
 *     required: true
 *    summary: Aggiunta biglietto richiesto
 *    description: viene inserito il nuovo biglietto scelto nella lista di biglietti acquistati
 *    responses:
 *     200:
 *      description: il biglietto scelto in base al form compilato
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          _id:
 *           type: ObjectId
 *           description: ID del biglietto
 *           example: 61b3f74b98111ddceb4b78a0
 *          viaggio:
 *           type: ObjectId
 *           description: ID del viaggio
 *           example: 61b3f64ece9723f367f3a842
 *          data_viaggio:
 *           type: string
 *           description: data del viaggio
 *           example: 2001-03-23
 *          stazione_partenza:
 *           type: ObjectId
 *           description: ID della stazione
 *           example: 61ab9eb31e607d0f2cce7c58
 *          stazione_arrivo:
 *           type: ObjectId
 *           description: ID della stazione
 *           example: 61aba0b31e607d0f2cce7c68
 *          intestatario:
 *           properties:
 *            name:
 *             type: string
 *             description: nome intestatario del biglietto
 *             example: Cavallin
 *            cognome:
 *             type: string
 *             description: cognome intestatario del biglietto
 *             example: Pestino
 *     
 *     400:
 *      description: errore per dati non completi, dati non validi, viaggio non valido
 */
app.post('/biglietti', (request, response) => {
    if(!request.body.stazione_partenza || !request.body.stazione_arrivo || !request.body.viaggio || !request.body.nome || !request.body.cognome){
        response.status(400)
        response.send("Dati non completi")
        return;
    }
    
    let data_viaggio = moment(request.body.data_viaggio);
    if(!data_viaggio.isValid() || data_viaggio.startOf('day').isBefore(moment().startOf('day'))){
        response.status(400)
        response.send("Data non valida")
        return;
    }

    if(!database.collection("viaggi").findOne({
        _id : ObjectId(request.body.viaggio),
        fermate : { $elemMatch: {stazione : ObjectId(request.query.stazione_partenza)}},
        fermate : { $elemMatch: {stazione : ObjectId(request.query.stazione_arrivo)}}
    })){
        response.status(400)
        response.send("Viaggio non valido")
        return;
    }

    database.collection("biglietti_acquistati").insertOne({
        viaggio: ObjectId(request.body.viaggio),
        data_viaggio: data_viaggio.format("YYYY-MM-DD"),
        stazione_partenza: ObjectId(request.body.stazione_partenza),
        stazione_arrivo: ObjectId(request.body.stazione_arrivo),
        intestatario : {
            nome: request.body.nome,
            cognome: request.body.cognome,
            ...(request.body.telefono && {telefono: request.body.telefono}),
            ...(request.body.data_nascita && {data_nascita: moment(request.body.data_nascita).format("YYYY-MM-DD")})
        }
    });
    response.sendStatus(200);
})

function trovaFermataInViaggio(viaggio, stazione) {
    return viaggio.fermate.find(fermata => {
        return fermata.stazione.toString() == stazione.toString()
    })
}

function trovaIndiceFermataInViaggio(viaggio, stazione) {
    return viaggio.fermate.findIndex(fermata => {
        return fermata.stazione.toString() == stazione.toString()
    })
}
/**
 * @swagger
 * /biglietti:
 *  get:
 *   summary: Lista di biglietti
 *   description: viene mostrata la lista di tutti i biglietti acquistati precendetemente
 *   responses:
 *    200:
 *     description: lista di biglietti acquistati precedentemente
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          BigliettiAcquistati:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             _id:
 *              type: ObjectId
 *              description: ID del biglietto
 *              example: 61b3f74b98111ddceb4b78a0
 *             viaggio:
 *              type: ObjectId
 *              description: ID del viaggio
 *              example: 61b3f64ece9723f367f3a842
 *             data_viaggio:
 *              type: string
 *              description: data del viaggio
 *              example: 2001-03-23
 *             stazione_partenza:
 *              type: ObjectId
 *              description: ID della stazione
 *              example: 61ab9eb31e607d0f2cce7c58
 *             stazione_arrivo:
 *              type: ObjectId
 *              description: ID della stazione
 *              example: 61aba0b31e607d0f2cce7c68
 *             intestatario:
 *              properties:
 *               name:
 *                type: string
 *                description: nome intestatario del biglietto
 *                example: Cavallin
 *               cognome:
 *                type: string
 *                description: cognome intestatario del biglietto
 *                example: Pestino 
 *             
 */ 
app.get('/biglietti', (request, response) => {
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

            let info_espanse = result.map((biglietto) => {
                let fermata_partenza = trovaFermataInViaggio(biglietto.info_viaggio, biglietto.stazione_partenza)
                let fermata_arrivo = trovaFermataInViaggio(biglietto.info_viaggio, biglietto.stazione_arrivo)
                return {
                    ...biglietto,
                    data_partenza: moment(biglietto.data_viaggio).add(moment.duration(fermata_partenza.ora)),
                    data_arrivo: moment(biglietto.data_viaggio).add(moment.duration(fermata_arrivo.ora))
                }
            })


            response.send(info_espanse);
        })
})


app.get('/viaggi-tra-stazioni', (request, response) => {
    let data_viaggio = moment(request.query.data_viaggio)
    if (!('stazione_partenza' in request.query) || !('stazione_arrivo' in request.query) || !data_viaggio.isValid()) {
        response.sendStatus(400);
        return;
    }

    if(data_viaggio.startOf('day').isBefore(moment().startOf('day'))){
        response.status(400)
        response.send("Data non valida")
        return;
    }
    
    potenzialiViaggi = database.collection("viaggi").find({
        ["giorni." + data_viaggio.format("dddd")] : true,
        fermate : { $elemMatch: {stazione : ObjectId(request.query.stazione_partenza)}}
    }).toArray(async (error, tuttiViaggi) => {
        if (error) {
            console.log(error);
            response.sendStatus(500);
        }


        let potenzialiViaggi = tuttiViaggi.filter(viaggio => trovaIndiceFermataInViaggio(viaggio, request.query.stazione_partenza) < trovaIndiceFermataInViaggio(viaggio, request.query.stazione_arrivo))
        let viaggiConPosti = await Promise.all(potenzialiViaggi.map(async viaggio => {
            let indexPartenza = trovaIndiceFermataInViaggio(viaggio, request.query.stazione_partenza)
            let indexArrivo = trovaIndiceFermataInViaggio(viaggio, request.query.stazione_arrivo)
            let bigliettiChePotrebberoCollidere = await database.collection("biglietti_acquistati").find(
                {
                    data_viaggio: data_viaggio.format("YYYY-MM-DD"),
                    viaggio: viaggio._id
                }
            ).toArray()


            let postiDisponibili = viaggio.posti

            bigliettiChePotrebberoCollidere.forEach(biglietto => {
                let indexPartenzaBiglietto = trovaIndiceFermataInViaggio(viaggio, biglietto.stazione_partenza)
                let indexArrivoBiglietto = trovaIndiceFermataInViaggio(viaggio, biglietto.stazione_arrivo)
                if ((indexPartenzaBiglietto <= indexPartenza && indexPartenza < indexArrivoBiglietto)
                    ||
                    (indexPartenzaBiglietto < indexArrivo && indexArrivo <= indexArrivoBiglietto)
                ) {
                    postiDisponibili--
                }
            })
            return {
                ...viaggio,
                posti_disponibili: postiDisponibili,
                index_partenza: indexPartenza,
                index_arrivo: indexArrivo
            }
        }))

        viaggiConPosti = viaggiConPosti.sort((a, b) => {
            return moment.duration(a.fermate[a.index_partenza].ora).asMilliseconds() - moment.duration(b.fermate[b.index_partenza].ora).asMilliseconds()
        })

        response.send(viaggiConPosti)
    })
})