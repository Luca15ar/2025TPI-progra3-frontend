/* -- Obtengo los elementos del HTML -- */
let ulJuegos = document.querySelector("#lista-juegos");
let divBotones = document.querySelector(".contenedor-botones");
let pElementosCarritos = document.querySelector("#texto-items-carrito");
let imgCarrito = document.querySelector("#img-carrito");
let precioTotal = document.querySelector("#precio-total");

//  Métodos
/* -- Eliminar juegos del carrito -- */
function eliminarJuego(e)
{
    /*  Obtengo los datos del juego seleccionado, comparo entre los objetos que haya en el array del LocalStorage y
        modifico su valor en cantidad restandole 1. Si la cantidad del elemento queda en 0, lo elimino del array y si se
        elimina el último juego del array, llamo a limpiarCarrito() para eliminar el array vacío. 
        Luego guardo los cambios y muestro los cambios realizados.
    */

    let elementoClickeado = e.target;
    
    let contenedor = elementoClickeado.closest(".carta-juego");

    let elementoNombre = contenedor.querySelector(".nombre-juego");

    let nombreJuego = elementoNombre.textContent;

    let carritoParseado = obtenerCarrito();
    let flagJuegoPreExistente = false;

    if(carritoParseado)
    {
        for(let element of carritoParseado) 
        {
            if(element.nombre == nombreJuego)
            {
                element.cantidad = element.cantidad - 1;
                flagJuegoPreExistente = true;
                break;
            }
        }
    }
    
    if(flagJuegoPreExistente)
    {
        carritoParseado = carritoParseado.filter(element => element.cantidad > 0);
    }

    if(!carritoParseado || carritoParseado.length === 0) 
    {
        limpiarCarrito();
    } else 
    {
        guardarCarrito(carritoParseado);
        mostrarCarrito(carritoParseado);
        actualizarPrecioCarrito(carritoParseado);
    }
}

/* -- Mostrar juegos en el carrito -- */
function mostrarCarrito(carrito)
{
    /*  Recorro el array del carrito y en cada iteración del array, accedo y extraigo los datos del objeto para posteriormente, ubicarlos en el lugar 
        correspondiente para armar el bloque de HTML de forma dinámica y por último, modifico el HTML ya existente por el nuevo que creé. También, 
        modifico el contador de juegos, poniendole el total de juegos que hay en el carrito.
    */

    let htmlJuegosCarrito = "";
    pElementosCarritos.classList.add('visible');
    imgCarrito.classList.add('visible');
    
    if(carrito)
    {
        carrito.forEach(juego => {
            htmlJuegosCarrito += `
                <li>
                    <div class="carta-juego">
                        <img class="img-juego" src="${juego.img}" alt="${juego.nombre}">
                        <h3 class="nombre-juego">${juego.nombre}</h3>
                        <p class="precio-juego">$${juego.precio}</p>
                        <div class="contenedor-botones-juego">
                            <button class="btn-eliminar">Eliminar</button>
                        </div>
                    </div>
                </li>
            `;
        });

        pElementosCarritos.classList.replace('visible', 'hidden');
        imgCarrito.classList.replace('visible', 'hidden');
    }
    else
    {
        pElementosCarritos.classList.replace('hidden', 'visible');
        imgCarrito.classList.replace('hidden', 'visible');
    }

    ulJuegos.innerHTML = htmlJuegosCarrito;
}

/* -- Actualizar el precio total -- */
function actualizarPrecioCarrito(carrito)
{
    /*  Verifico si el carrito tiene juegos, si tiene aunque sea uno, lo recorro con un forEach y extraigo el precio del producto. Lo modifico
        para convertirlo en un dato operable para realizar los calculos y lo guardo en una variable acumulativa. Por último, lo convierto nuevamente
        en un string para inyectarlo en el html.
    */
    
    let totalPrecioJuegos = 0;

    if(carrito)
    {
        carrito.forEach(juego => {
            totalPrecioJuegos += juego.precio;
        });

        precioTotal.innerText = totalPrecioJuegos.toString();
    }
    else
    {
        precioTotal.innerText = '0.00';
    } 
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

/* -- Limpiar el carrito -- */
function limpiarCarrito() 
{
    /*  Uso la función integrada del LocalStorage para eliminar el array existente, muestro los cambios después de hacerlo.
    */

    localStorage.removeItem("carrito");

    mostrarCarrito(obtenerCarrito());

    actualizarPrecioCarrito(obtenerCarrito());
}

window.addEventListener("DOMContentLoaded", () => {
    ulJuegos.addEventListener("click", e => {
        if(e.target.classList.contains("btn-eliminar"))
        {
            eliminarJuego(e);
        }
    });

    divBotones.addEventListener("click", e => 
        {
            if(e.target.classList.contains("btn-vaciar-carrito"))
            {
                limpiarCarrito();
            }
            else
            {
                limpiarCarrito();
            }
        });
});

/* --- Función inicializadora --- */
function init()
{
    const carritoEnMemoria = obtenerCarrito();
    mostrarCarrito(carritoEnMemoria);
    actualizarPrecioCarrito(carritoEnMemoria);
}

init();