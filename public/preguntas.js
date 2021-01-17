//iniciar coneccion socket
const socket = io();




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

    //Cargar Respuesta
    ContenedorRespuestas.innerHTML = `
    <div class="answers-btn">
        <button type="button" class="btn btn-primary btn-lg btn-answer" onclick="enviarRespuesta(this)">${pregunta.correct_answer}</button>
    </div>
    <div>
        <button type="button" class="btn btn-primary btn-lg btn-answer" onclick="enviarRespuesta(this)">${pregunta.incorrect1}</button>
    </div>
    <div>
        <button type="button" class="btn btn-primary btn-lg btn-answer" onclick="enviarRespuesta(this)">${pregunta.incorrect2}</button>
    </div>
    <div>
        <button type="button" class="btn btn-primary btn-lg btn-answer" onclick="enviarRespuesta(this)">${pregunta.incorrect3}</button>
    </div>
    `;
};


//Funciones Socket

//Muestra Pregunta enviada 
socket.on('enviar:pregunta', (pregunta)=>{
    window.levantarPregunta(pregunta);

})

//Muestra el Numerode la Pregunta
socket.on('enviar:numero',(nPregunta)=>{
    document.querySelector("#contador-preguntas").innerHTML = "";
    document.querySelector("#contador-preguntas").innerHTML = `<h1 class="question ms-3">Pregunta ${nPregunta+1} de 10</h1>`
})

//Recibe informacion si alguien se conecta a la partida
socket.on('join:User',(id)=>{
    let contenedorJugadores = document.querySelector("#jugadores")
    contenedorJugadores.innerHTML +=`
    <div class="avatar text-center">
        <div class="avatar-img img-fluid"> <img src="img/Asset 32.png" alt="" class="img-av"> </div>
        <span class="avatar-name">${id}</span>
    </div>
    `;
});

//Envia respuesta de la pregunta
enviarRespuesta = function(id){
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

