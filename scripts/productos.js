/* Variable estática que guarda la url donde está deployada la página*/
const url = "http://localhost:3000";

/* -- Obtengo los elementos del HTML -- */
let contenedorJuegos = document.querySelector(".contenedor-juegos");
let contenedorDlcs = document.querySelector(".contenedor-dlcs");
let barraBusqueda = document.querySelector("#barra-busqueda");

let listaJuegos = [];

// Métodos
/* --- Obtener juegos de la BD --- */
async function obtenerJuegos() 
{
    try
    {
        let respuesta = await fetch(`${url}/products`);

        let { payload } = await respuesta.json();

        listaJuegos = payload;

        console.table(listaJuegos);

        mostrarJuegos(listaJuegos);
    }
    catch(error)
    {
        console.error(error);
        
    }
}

/* --- Mostrar juegos --- */
function mostrarJuegos(arrayJuegos)
{
    /*  Recorro el array de juegos con un forEach porque me resulta más legible y como son pocos objetos que contiene, optimizo el uso de memoria.
        En cada iteración del array, accedo y extraigo los datos del objeto para posteriormente, ubicarlos en el lugar correspondiente para armar 
        el bloque de HTML de forma dinámica y por último, modifico el HTML ya existente por el nuevo que creé. 
    */
    
    let htmlJuegos = "";
    let htmlDlcs = "";

    arrayJuegos.forEach(juego => {
        htmlJuegos += `
            <div class="carta-juego">
                <img class="img-juego" src="${juego.imagen}" alt="${juego.nombre}">
                <div class="caption">
                    <h3 class="nombre-juego hidden">${juego.nombre}</h3>
                    <p class="precio-juego">ARS$ ${juego.precio}</p>
                    <img class="img-carrito" src="../../assets/img/cart.png" alt="carrito">
                </div>
            </div>
            `; 

        if(juego.dlcs.length > 0)
        {
            juego.dlcs.forEach(dlc => {
                htmlDlcs += `
                <div class="carta-juego">
                    <img class="img-juego" src="${dlc.imagen}" alt="${dlc.nombre}">
                    <div class="caption">
                        <h3 class="nombre-juego hidden">${dlc.nombre}</h3>
                        <p class="precio-juego">ARS$ ${dlc.precio}</p>
                        <img class="img-carrito" src="../../assets/img/cart.png" alt="carrito">
                    </div>
                </div>
                `;
            });
        }
    });

    contenedorJuegos.innerHTML = htmlJuegos;
    contenedorDlcs.innerHTML = htmlDlcs;
}

/* --- Filtrar juegos --- */
barraBusqueda.addEventListener("keyup", filtrarJuegos);

function filtrarJuegos()
{
    /*  Creo un "escuchador de evento" para la barra buscadora que llama a la función "filtrarJuegos" cada que se levanta una tecla.
        El método guarda la letra pulsada en un array, que luego se usa para comparar si las letras que contenie están presentes en el array que tiene
        todas las juegos. Para ello uso el método propio de los arrays, filter, para comparar con el nombre de cada objeto del array si coincide
        con las letras presionadas. Por último, llama al método "mostrarJuegos" para mostrar las juegos que coincidan, pasandole el nuevo array
        que se generó, que contiene las juegos filtrados.
    */

    let valorInput = barraBusqueda.value;
    let listaJuegosFiltrados = listaJuegos.filter(juego =>juego.nombre.toLowerCase().includes(valorInput.toLowerCase()));

    mostrarJuegos(listaJuegosFiltrados);
}

/* -- Agregar productos al carrito -- */
function agregarJuegosCarrito(e)
{
    /*  Obtengo la referencia al elemento clickeado desde en base al evento, luego me fijo si ya hay algo cargado en el LocalStorage como "carrito".
        Reviso si tiene contenido, si tiene: modifico la flag, sino: creo un array para añadirle los productos seleccionados.
        Creo un objeto con los datos de la fruta seleccionada y lo agrego al array. Guardo el array con los productos añadidos al carrito, en el localStorage
        y muestro todos los productos en el carrito.
    */

    let elementoClickeado = e.target;
    
    let contenedor = elementoClickeado.closest(".carta-juego");

    let elementoImagen = contenedor.querySelector(".img-juego");
    let elementoNombre = contenedor.querySelector(".nombre-juego")
    let elementoPrecio = contenedor.querySelector(".precio-juego");
    
    let imagenJuego = elementoImagen.src;
    let nombreJuego = elementoNombre.textContent;
    let precioString = elementoPrecio.textContent;
    let precioParseado = precioString.replace(/[^\d]/g, '');
    let precioJuego = parseInt(precioParseado);

    let carritoParseado = obtenerCarrito();
    let flagJuegoPreExistente = false;

    if(carritoParseado)
    {
        for(let element of carritoParseado) 
        {
            if(element.nombre == nombreJuego)
            {
                flagJuegoPreExistente = true;
                break;
            }
        }
    }
    else
    {
        carritoParseado = [];
    }

    if(!flagJuegoPreExistente)
    {
        let nuevoJuego = 
        {
            "nombre": nombreJuego,
            "img": imagenJuego,
            "precio": precioJuego,
            "cantidad": 1
        }

        carritoParseado.push(nuevoJuego);
    }

    guardarCarrito(carritoParseado);
}

/* -- Obtener carrito -- */
function obtenerCarrito() 
{
    /*  Obtengo el carrito del LocalStorage, lo parseo a un array y lo retorno.
    */

    let carritoObtenido = localStorage.getItem("carrito");
    let carritoParseado = JSON.parse(carritoObtenido);

    return carritoParseado;
}

/* -- Guardar carrito -- */
function guardarCarrito(carrito) 
{
    /*  Guardo el carrito recibido al LocalStorage, previamente transformado a string.
    */

    let carritoStringify = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoStringify);
}

document.addEventListener('click', e => {
    if(e.target.classList.contains('img-carrito'))
    {
    agregarJuegosCarrito(e);
    }
});

/* --- Función inicializadora --- */
function init()
{
    obtenerJuegos();
}

init();