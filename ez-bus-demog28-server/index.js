const { response } = require('express');
const Express = require('express')

let app = Express();

app.listen(8081, ()=>{
    console.log("server running");
});

app.get('/', (request, response)=>{
    response.send('Home');
})


app.get('/cose/:numero', (request, response)=>{
    response.send('parameter example ' + response.params.numero);
})