//no utilizamos el window.onload ya que cargamos el fichero javascript al final del documento html, de manera que al ejecutarse, la página ya está totalmente cargada

//////////////////////////////////////////////////////////////////////////////
//elementos del dom
var botonClasico = document.getElementById("botonClasico");
var botonAventura = document.getElementById("botonAventura");
var selectTema = document.getElementById("selectTema");
var pMensajes = document.getElementById("pMensajes");
var pPalabra = document.getElementById("pPalabra");
var inputLetra = document.getElementById("letra");
var spans = document.getElementsByTagName("span");
var divElegirCategoria = document.getElementById("elegirCategoria");
var botonesCategoria = document.getElementsByClassName("categoria");
var divPalabra = document.getElementById("divPalabra");

//variables
var letra = new String();
var palabra = new String();

//listeners
botonClasico.addEventListener("click", jugarBasico);

//evento al presionar la tecla enter
inputLetra.addEventListener("keypress", guardarDatos);
/////////////////////////////////////////////////////////////////////////////

//ocultamos el menú categoría
divElegirCategoria.style.display="none";
divPalabra.style.display="none";

function jugarBasico() {
  //escondemos los botones del menú de inicio
  botonClasico.style.display="none";
  botonAventura.style.display="none";
  //mostramos el html del juego
  divElegirCategoria.style.display="block";
}
function guardarDatos(event) {
  //si el código de la tecla es el del intro
  if (event.keyCode == 13) {
    //recogemos la letra del input
    let texto = inputLetra.value;
    console.log(texto);
    //pasamos la letra a minúscula por si no lo estuviera
    letra=texto.toLowerCase();
    //verificamos si la letra se encuentra en la palabra
    verificarLetra();
  }
}
function verificarLetra() {
  let contadorLetras = 0;
  //nos recorremos la palabra
  for (var i = 0; i < palabra.length; i++) {
    //li la letra pulsada está en ella
    if (letra == palabra.charAt(i)) {
      //pintamos la letra
      pintarLetra(letra, i);
      //contador para mostrar el número de letras encontradas en el mensaje
      contadorLetras++;
      pMensajes.innerHTML = "La letra se encuentra " + contadorLetras + " veces en la palabra";
    }else{ //si la letra no está

      
    }
  }
}
function pintarLetra(letra, posicion) {
  //pasamos la letra a mayúscula para imprimirla
  let letraMayus = letra.toUpperCase();
  //el array de spans contiene los huecos de la palabra, quitamos el borde e imprimimos la/s letra/s
  spans[posicion].style.border = "none";
  spans[posicion].innerHTML = letraMayus;
  //limpiamos el input de introducir letra
  inputLetra.value = "";
}

function obtenerTema() {
  return selectTema.options[selectTema.selectedIndex].text;
}

function iniciarJuegoBasico() {
  //recogemos el tema del select
  var tema = obtenerTema();

  //elegimos array según tema
  var arrayElegido = crearArray(tema);

  //sacamos un numero aleatorio para elegir palabra del array
  var numero = Math.floor(Math.random() * arrayElegido.length);

  //obtenemos la palabra
  palabra = arrayElegido[numero];
  //ayuda para el desarrollo
  console.log(palabra);
  //mostramos los huecos de la palabra en pantalla
  mostrarHuecos(palabra);

  pMensajes.innerHTML = "Introduce una letra y presiona enter";
  //mostramos el input donde introducir las letras
  inputLetra.style.display = "block";
  //ponemos el foco
  inputLetra.focus();

  //en este momento, el jugador presiona una letra y la tecla enter y se activa el listener keypress que llamará a una función que recoge la letra
  //seguimos a partir del método obtenerLetra
}

function mostrarHuecos(palabra) {
  for (var i = 0; i < palabra.length; i++) {
    var span = document.createElement("span");
    span.setAttribute("class", "letras");
    pPalabra.appendChild(span);
  }
}

function crearArray(tema) {
  switch (tema) {
    case "Animales":
      return (animales = [
        "vaca",
        "cabra",
        "oveja",
        "burro",
        "leon",
        "ballena",
        "gallo"
      ]);
      break;
    case "Alimentos":
      return (alimentos = [
        "arroz",
        "pasta",
        "leche",
        "pan",
        "azucar",
        "pollo",
        "queso"
      ]);
      break;
    case "Ciudades":
      return (ciudades = [
        "madrid",
        "valencia",
        "alicante",
        "castellon",
        "xativa",
        "chella",
        "santander"
      ]);
      break;
  }
}
