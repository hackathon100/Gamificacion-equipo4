const express = require('express');
const path = require('path');
const app = express();
const SocketIO = require('socket.io');

//settings:
app.set('port', process.env.PORT  || 3000);

//static file
app.use(express.static(path.join(__dirname, 'public')));

//start the server
const server = app.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'));
});

//init socket
const io = SocketIO(server);


//Variables
preguntas = [
    {pregunta: "Cual es el sinonimode Ganar",correct_answer: "Exito", incorrect1: "Derrota",incorrect2: "Fracaso", incorrect3: "Perdida"},
    {pregunta: "Cual es el sinonimode Perder",incorrect1: "Aprender", correct_answer: "Derrota", incorrect2: "Exito", incorrect3: "Mejorar"},
    {pregunta: "Cual noes un lenguaje de programacion", correct_answer: "HTML", incorrect1: "PYTHON", incorrect2: "JAVA", incorrect3:"PHP"}
    
];
var respondieron = 0;
var nPregunta = 0;
//Web Socket
io.on('connection',(socket)=>{

    //al Recibir nueva conexion:
    console.log("new conecction", socket.id);
    io.sockets.emit('join:User',socket.id);

    //Si hay a lo menos 2 jugadores, enviara la pregunta
    if(io.engine.clientsCount >= 2){
        io.sockets.emit('enviar:pregunta', preguntas[nPregunta])
    };

    //Recibe y Revisa la pregunta, enviara true o false,
    //Ademas verifica si todos respondieron para enviar nueva pregunta.
    socket.on('enviar:respuesta', (data)=>{
        if(preguntas[0].correct_answer == data){
            console.log("Respondio Correctamente");
            result = true;
            
        }else{
            console.log("Respondio Incorrectamente");
            result = false;

        }
        respondieron ++;
        io.sockets.emit('respuesta:resultado', result);

        //si la cantidd de respeustas es igual a la cantidad de conexiones:
        if(respondieron == io.engine.clientsCount){
            console.log("todos respondieron!")
            respondieron = 0;

            //Enviar nueva pregunta si la cantidad de preguntas aun no se supera
            console.log(preguntas.length);
            if(nPregunta < preguntas.length){
                nPregunta ++;
                io.sockets.emit('enviar:pregunta', preguntas[nPregunta])
            }
            //termino el temario, se repiten las preguntas
            if(nPregunta == 3){
                console.log("Todas las preguntas Contestadas");
                nPregunta = 0;
                io.sockets.emit('enviar:pregunta', preguntas[nPregunta])
            };
            
        }
    });


})
