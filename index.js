var server = require('./ez-bus-demog28-server/index');

server.app.listen(8081, async function () {
    await server.connettiDatabaseEPrendiApp();
    console.log('Server running on port %d', 8081);
});