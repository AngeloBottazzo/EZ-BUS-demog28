var server = require('./ez-bus-demog28-server/index');

const port = 8081

server.app.listen(port, async function () {
    await server.connettiDatabaseEPrendiApp();
    console.log('Server disponibile alla porta %d. Documentazione sulle API disponibile qui: http://localhost:8081/api-docs', port);
})