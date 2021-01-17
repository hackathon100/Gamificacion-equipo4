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
    <div class="col-6 text-center mx-auto pt-4">
        <h1 class="bg-info text-white rounded-pill ">${pregunta.pregunta}</h1>
    </div>
    `;

    //Cargar Respuesta
    ContenedorRespuestas.innerHTML = `
        <div class="col-3 text-center">
            <button class="btn btn-info text-white btn-respuesta" onclick="enviarRespuesta(this)">${pregunta.correct_answer}</button>
        </div>
        <div class="col-3 text-center">
            <button class="btn btn-info text-white btn-respuesta" onclick="enviarRespuesta(this)">${pregunta.incorrect1}</button>
        </div>
        <div class="col-3 text-center">
            <button class="btn btn-info text-white btn-respuesta" onclick="enviarRespuesta(this)">${pregunta.incorrect2}</button>
        </div>
        <div class="col-3 text-center">
            <button class="btn btn-info text-white btn-respuesta" onclick="enviarRespuesta(this)">${pregunta.incorrect3}</button>
        </div>
        
        
    `;
};



//Funciones Socket

//Muestra Pregunta enviada 
socket.on('enviar:pregunta', (pregunta)=>{
    window.levantarPregunta(pregunta);
})

//Recibe informacion si alguien se conecta a la partida
socket.on('join:User',(id)=>{
    let contenedorJugadores = document.querySelector("#jugadores")
    contenedorJugadores.innerHTML +=`
    <H1>${id}</H1>
    `;
});

//Envia respuesta de la pregunta
enviarRespuesta = function(id){
    let respuesta = id.innerText;
    socket.emit('enviar:respuesta', respuesta);
}

//Recibe Resultado de la Pregunta
socket.on('respuesta:resultado',(result)=>{
    if(result){
        //Inflinje Daño

    }else{
        //Recive Daño
        
    }
})

