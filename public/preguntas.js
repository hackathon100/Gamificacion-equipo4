//iniciar coneccion socket
const socket = io();



//Mostrar Pregunta en DOM
window.levantarPregunta = (pregunta)=>{
    //Buscar Contenedores Para Asignar pregunta
    const contenedorPregunta = document.querySelector("#pregunta");
    const ContenedorRespuestas = document.querySelector("#respuestas");
    
    //Limiar pregunta previa
    contenedorPregunta.innerHTML ="";
    ContenedorRespuestas.innerHTML = "";

    //Cargar Pregunta
    contenedorPregunta.innerHTML = `
    <div class="d-grid gap-2 my-5">
        <button id="pregunta" class="btn btn-primary btn-question" type="button">${pregunta.pregunta}</button>
    </div>
    `;

    
    //Cargar Respuesta de forma aleatoria
    var respuestas = [pregunta.incorrect1,pregunta.incorrect2,pregunta.incorrect3,pregunta.correct_answer];
    random = respuestas.sort(function() {return Math.random() - 0.5});
    for (let i =0; i < respuestas.length; i++) {
        ContenedorRespuestas.innerHTML += `
        <div class="answers-btn">
            <button type="button" class="btn btn-primary btn-lg btn-answer btn-respuesta" onclick="enviarRespuesta(this)">${respuestas[i]}</button>
        </div>`;

    }

};


//Funciones Socket

//Muestra Pregunta enviada 
socket.on('enviar:pregunta', (pregunta)=>{
    window.levantarPregunta(pregunta);

})

//Muestra el Numero de la Pregunta
socket.on('enviar:numero',(nPregunta)=>{
    document.querySelector("#contador-preguntas").innerHTML = "";
    document.querySelector("#contador-preguntas").innerHTML = `<h1 class="question ms-3">Pregunta ${nPregunta+1} de 10</h1>`
})

//Recibe informacion si alguien se conecta a la partida
let usuariosRegistrados = 0;
socket.on('join:User',(conectados)=>{
    console.log(conectados);
    let contenedorJugadores = document.querySelector("#jugadores")
    //si cuando alguien ingresa y la cantidad de jugadores no es la misma que la cantidad regitrada en el DOM, Registra los faltantes
    if(usuariosRegistrados < conectados){
        for (let i = usuariosRegistrados; i < conectados; i++) {
            imgJugador = (randomInteger(3,10)*10)+2;
            contenedorJugadores.innerHTML +=`
            <div id="jugador${conectados}"class="avatar text-center">
                <div class="avatar-img img-fluid"> <img src="img/Asset ${imgJugador}.png" alt="" class="img-av"> </div>
                <span class="avatar-name">${""}</span>
            </div>
            `;
            console.log("registrar en for");
            
            
        }
        usuariosRegistrados = conectados;
    }

});

//Recibe inforamcion si alguien se desconecta de la partida
socket.on('left:User',(conectados)=>{
    let contenedorJugadores = document.querySelector("#jugadores")
    let jugador = contenedorJugadores.querySelector("#jugador"+(conectados+1));
    jugador.innerHTML = "";
    console.log("Usuario borrado");
    usuariosRegistrados = conectados;
});

//Envia respuesta de la pregunta
enviarRespuesta = function(id){
    let botones = document.querySelectorAll(".btn-respuesta");
    botones.forEach(element => {
        element.classList.add("disabled");
    });
    let respuesta = id.innerText;
    socket.emit('enviar:respuesta', respuesta);
}

//Recibe Resultado de la Pregunta
socket.on('respuesta:resultado',(data)=>{
    if(data.result){
        //Inflinje Daño
        let barraTitan = document.querySelector("#vida-titan");
        let nVidaTitna = document.querySelector("#numero-vida-titan");
        barraTitan.style = `width: ${data.vidaTitan}%`;
        nVidaTitna.innerText = data.vidaTitan;

    }else if (!data.result){
        //Recive Daño
        let barraEjer = document.querySelector("#vida-ejer");
        let nVidaEjer = document.querySelector("#numero-vida-ejer")
        barraEjer.style = `width: ${data.vidaEjercito}%`;
        nVidaEjer.innerText = data.vidaEjercito;
    };
});

//Resultados de la Partida:
socket.on('partida:terminada', (resultado)=>{
    if (resultado == "Win"){
        console.log("Ganaste");
        
    }else if (resultado == "Lose"){
        console.log("Perdiste");
    }else if (resultado == "Empate"){
        console.log("Empate");
    };
});

//Random Number
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
