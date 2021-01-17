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

//Web Socket
io.on('connection',(socket)=>{
    //al Recibir nueva conexion:
    console.log("new conecction", socket.id);
    io.sockets.emit('join:User',socket.id);

    if(io.engine.clientsCount > 4){
        
    }


})
