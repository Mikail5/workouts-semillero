import { registros } from "./registros.js";

const contenido = document.querySelector('#contenido');
let filtros = [];

function mostrarRegistros(arrayRegistros) {
    let tarjetas = arrayRegistros.map(registro => {
        let nuevo = (registro.nuevo) ? '<span id="nuevo">NEW!</span>' : '';
        let destacado = (registro.destacado) ? '<span id="destacado">FEATURED</span>' : ''; 
        return `
            <section class="tarjeta">
                <div class="info">
                    <img src="images/${registro.imagen}" alt="imagen1">
                    <p>${registro.nombre} ${nuevo} ${destacado}</p>
                    <p><a href="#">${registro.titulo}</a></p>
                    <p>${registro.descirpcion}</p>
                </div>
                <div id="filtro">
                    ${ registro.filtros.map(mapearFiltros).join('') }
                </div>
            </section>
        `;
    }).join('');
    contenido.innerHTML = tarjetas;
    listenersAgregarFiltro();
}

function mapearFiltros(filtro) {
    /* const boton = document.createElement('button');
    boton.dataset.criterio = filtro;
    boton.textContent = filtro; */
    let boton = `
        <button data-criterio="${filtro}">${filtro}</button>
    `;
    return boton;
}

function listenersAgregarFiltro() {
    document.querySelectorAll('#filtro').forEach(contendorBotones => {
        contendorBotones.addEventListener('click', agregarFiltros);
    });
}

function agregarFiltros(e) {
    e.preventDefault();
    if (filtros.some(filtro => filtro == e.target.dataset.criterio) || !e.target.dataset.criterio) return;
    filtros.push(e.target.dataset.criterio);
    gestionarFiltros();
}

function gestionarFiltros(){
    if (filtros.length > 0) {
        let registrosFiltrados = filtrarRegistros(registros);
        mostrarRegistros(registrosFiltrados);
        mapearCriteriosFiltrados();
    }
    else{
        quitarContenedorCriteriosFiltrados();
        mostrarRegistros(registros);
    }
}

function filtrarRegistros(registros) {
    let arrayFiltrados = Array.from(registros);
    filtros.forEach(criterio => {
        arrayFiltrados = arrayFiltrados.filter(registroFiltrado => registroFiltrado.filtros.some(filtro => criterio == filtro));
    });
    return arrayFiltrados;
}

function mapearCriteriosFiltrados() {
    const section = document.createElement('section');
    section.classList.add('tarjeta');
    section.id = 'listaFiltros';

    const p = document.createElement('p'); 
    p.innerHTML = filtros.map(filtroActual => {
        return `
            <span>${filtroActual}<button data-criterio="${filtroActual}">&#10005;</button></span>
        `;
    }).join('');
    section.appendChild(p);

    const span = document.createElement('span');
    span.classList.add('limpiar');
    span.dataset.criterio = 'BorrarTodo';
    span.textContent = 'Clear';
    section.appendChild(span);
    
    const primeraTajeta = contenido.querySelector('section:nth-child(1)');
    contenido.insertBefore(section, primeraTajeta);

    listenersQuitarFiltro();
}

function listenersQuitarFiltro() {
    document.querySelector('#listaFiltros').addEventListener('click', eliminarFiltros);
}

function eliminarFiltros(e) {
    e.preventDefault();
    if(e.target.dataset.criterio == 'BorrarTodo'){
        filtros = [];
    }
    else{
        filtros = filtros.filter(filtro => filtro != e.target.dataset.criterio);
    }
    gestionarFiltros();
}

function quitarContenedorCriteriosFiltrados(){
    const contenedorCriterios = document.querySelector('#listaFiltros');
    if(contenedorCriterios){
        contenido.removeChild(contenedorCriterios);
    }
}

window.addEventListener('load', () => { mostrarRegistros(registros) });