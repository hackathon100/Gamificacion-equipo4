const express = require('express');
const path = require('path');
const app = express();
const SocketIO = require('socket.io');

//settings:
app.set('port', process.env.PORT || 3000);

//static file
app.use(express.static(path.join(__dirname, 'public')));

//start the server
const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

//init socket
const io = SocketIO(server);


//Variables
preguntas = [{
        pregunta: "¿Cuanto es 20 + 16?",
        correct_answer: "36",
        incorrect1: "63",
        incorrect2: "44",
        incorrect3: "85"
    },

    {
        pregunta: "¿Cuanto es 25 + 80?",
        incorrect1: "125",
        correct_answer: "105",
        incorrect2: "154",
        incorrect3: "85"
    },

    {
        pregunta: "¿Cuanto es 8 * 2?",
        correct_answer: "16",
        incorrect1: "15",
        incorrect2: "85",
        incorrect3: "82"
    },

    {
        pregunta: "¿Cuanto es 20 / 2?",
        correct_answer: "10",
        incorrect1: "22",
        incorrect2: "44",
        incorrect3: "16"
    },

    {
        pregunta: "¿Cuanto es 25 / 25?",
        incorrect1: "125",
        correct_answer: "1",
        incorrect2: "0",
        incorrect3: "50"
    },

    {
        pregunta: "¿Cuanto es 8 * 8?",
        correct_answer: "64",
        incorrect1: "15",
        incorrect2: "16",
        incorrect3: "82"
    },

    {
        pregunta: "¿Cuanto es 20 + 6?",
        correct_answer: "26",
        incorrect1: "62",
        incorrect2: "42",
        incorrect3: "8"
    },

    {
        pregunta: "¿Cuanto es 25 - 8?",
        incorrect1: "18",
        correct_answer: "17",
        incorrect2: "14",
        incorrect3: "5"
    },

    {
        pregunta: "¿Cuanto es 8 - 2?",
        correct_answer: "6",
        incorrect1: "15",
        incorrect2: "5",
        incorrect3: "8"
    },

    {
        pregunta: "¿Cuanto es 8 - 1?",
        correct_answer: "7",
        incorrect1: "5",
        incorrect2: "8",
        incorrect3: "9"
    }

];
var respondieron = 0;
var nPregunta = 0;
let vidaTitan = 100;
let vidaEjercito = 100;
var conectados = 0;
//Web Socket
io.on('connection', (socket) => {

    //al Recibir nueva conexion:
    console.log("Usuario Conectado", socket.id);
    conectados++;
    io.sockets.emit('join:User', conectados);

    //Al Desconectar el usuario
    socket.on('disconnect', (socket) => {
        console.log(" Un usuario Desconectado ");
        conectados--;
        io.sockets.emit('left:User', conectados);


    });

    //Si hay a lo menos 2 jugadores, enviara la pregunta
    if (io.engine.clientsCount >= 2) {
        io.sockets.emit('enviar:pregunta', preguntas[nPregunta]);
    };

    //Recibe y Revisa la pregunta, enviara true o false,
    //Ademas verifica si todos respondieron para enviar nueva pregunta.
    socket.on('enviar:respuesta', (data) => {
        if (preguntas[nPregunta].correct_answer == data) {
            console.log("Respondio Correctamente");
            result = true;
            vidaTitan -= 10;
            io.sockets.emit('respuesta:resultado', {
                result,
                vidaTitan
            });
        } else {
            console.log("Respondio Incorrectamente");
            result = false;
            vidaEjercito -= 10;
            io.sockets.emit('respuesta:resultado', {
                result,
                vidaEjercito
            });

        }
        respondieron++;
        //si la cantidd de respeustas es igual a la cantidad de conexiones:
        if (respondieron == io.engine.clientsCount) {
            console.log("todos respondieron!")
            io.sockets.emit('enviar:numero', nPregunta);
            respondieron = 0;

            //Enviar nueva pregunta si la cantidad de preguntas aun no se supera
            if (nPregunta < preguntas.length) {
                console.log("Enviar Pregunta");
                nPregunta++;
                io.sockets.emit('enviar:pregunta', preguntas[nPregunta])
            }
            //termino el temario, se Levantan Estadisticas
            if (nPregunta == 3) {
                console.log("Todas las preguntas Contestadas");
                if (vidaEjercito > vidaTitan) {
                    io.sockets.emit('partida:terminada', "Win");
                } else if (vidaEjercito < vidaTitan) {
                    io.sockets.emit('partida:terminada', "Lose");
                } else {
                    io.sockets.emit('partida:terminada', "Empate");
                };

                vidaTitan = 100;
                vidaEjercito = 100;
                nPregunta = 0;

                //Nueva Partida
                io.sockets.emit('enviar:pregunta', preguntas[nPregunta])


            };

        }
    });


})