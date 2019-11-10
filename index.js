//no utilizamos el window.onload ya que cargamos el fichero javascript al final del documento html, de manera que al ejecutarse, la página ya está totalmente cargada

//////////////////////////////////////////////////////////////////////////////
//elementos del dom
var botonBasico = document.getElementById("botonBasico");
var botonAvanzado = document.getElementById("botonAvanzado");
var formularioBasico = document.getElementById("formularioBasico");
var selectTema = document.getElementById("selectTema");
var divMensajes = document.getElementById("divMensajes");
var botonEmpezar = document.getElementById("botonEmpezar");
var pPalabra = document.getElementById("pPalabra");
var inputLetra = document.getElementById("letra");

//variables
var letra = new String();
var palabra = new String();

//listeners
botonBasico.addEventListener("click", jugarBasico);
// botonAvanzado.addEventListener("click", jugarAvanzado);
selectTema.addEventListener("change", obtenerTema);
botonEmpezar.addEventListener("click", iniciarJuegoBasico);
//evento al presionar la tecla enter
inputLetra.addEventListener("keypress", guardarDatos);
/////////////////////////////////////////////////////////////////////////////

//ocultamos el html del juego (básico y avanzado)
formularioBasico.style.display = "none";
inputLetra.style.display = "none";

function jugarBasico() {
  //mostramos el html del juego
  formularioBasico.style.display = "block";
}
function guardarDatos(event) {
  //si el código de la tecla es el del intro
  if (event.keyCode == 13) {
    //recogemos la letra del input
    letra = inputLetra.value;
    console.log(letra);

    //verificamos si la letra se encuentra en la palabra
    verificarLetra();
  }
}
function verificarLetra(){
  var posicionesLetras= new Array();
  var contadorLetras= 0;
  for (var i =0; i<palabra.length; i++){
    if(letra == palabra.charAt(i)){
     posicionesLetras.push(i);
     contadorLetras++;
     divMensajes.innerHTML="La letra se encuentra " + contadorLetras + " veces en la palabra";
    }
  }
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

  divMensajes.innerHTML = "Introduce una letra y presiona enter";
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
        "Vaca",
        "Cabra",
        "Oveja",
        "Burro",
        "Leon",
        "Ballena",
        "Gallo"
      ]);
      break;
    case "Alimentos":
      return (alimentos = [
        "Arroz",
        "Pasta",
        "Leche",
        "Pan",
        "Azucar",
        "Pollo",
        "Queso"
      ]);
      break;
    case "Ciudades":
      return (ciudades = [
        "Madrid",
        "Valencia",
        "Alicante",
        "Castellon",
        "Xativa",
        "Chella",
        "Santander"
      ]);
      break;
  }
}
