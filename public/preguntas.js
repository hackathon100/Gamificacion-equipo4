//iniciar coneccion socket
const socket = io();

//Aca esta el Temario a Realizar
window.preguntas = [
    {pregunta: "Cual es el sinonimode Ganar",correct_answer: "Exito", incorrect1: "Derrota",incorrect2: "Fracaso", incorrect3: "Perdida"},
    {pregunta: "Cual es el sinonimode Perder",incorrect1: "Aprender", correct_answer: "Derrota", incorrect2: "Exito", incorrect3: "Mejorar"},
    {pregunta: "Cual noes un lenguaje de programacion", correct_answer: "HTML", incorrect1: "PYTHON", incorrect2: "JAVA", incorrect3:"PHP"}
    
];


window.addEventListener('DOMContentLoaded',()=>{
    window.levantarPregunta(window.preguntas[0]);
    
});

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
            <h3 class="btn btn-info text-white ">${pregunta.correct_answer}</h3>
        </div>
        <div class="col-3 text-center">
            <h3 class="btn btn-info text-white ">${pregunta.incorrect1}</h3>
        </div>
        <div class="col-3 text-center">
            <h3 class="btn btn-info text-white ">${pregunta.incorrect2}</h3>
        </div>
        <div class="col-3 text-center">
            <h3 class="btn btn-info text-white ">${pregunta.incorrect3}</h3>
        </div>
        
        
    `;
};



//Funciones Socket
socket.on('join:User',(id)=>{
    let contenedorJugadores = document.querySelector("#jugadores")
    contenedorJugadores.innerHTML +=`
    <H1>${id}</H1>
    `;
});
