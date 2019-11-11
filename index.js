//no utilizamos el window.onload ya que cargamos el fichero javascript al final del documento html, de manera que al ejecutarse, la página ya está totalmente cargada

//////////////////////////////////////////////////////////////////////////////
//elementos del dom
var botonClasico = document.getElementById("botonClasico");
var botonAventura = document.getElementById("botonAventura");
var pMensajes = document.getElementById("pMensajes");
var pPalabra = document.getElementById("pPalabra");
var inputLetra = document.getElementById("letra");
var spans = document.getElementsByTagName("span");
var divElegirCategoria = document.getElementById("elegirCategoria");
var botonesCategoria = document.getElementsByClassName("categoria");
var divPalabra = document.getElementById("divPalabra");
var divDibujo = document.getElementById("dibujo");
var pFallos = document.getElementById("fallos");
var pMonedas = document.getElementById("monedas");
var footer = document.getElementsByTagName("footer");
var divMensajeFinal = document.getElementById("mensajeFinal");
var pTextoFinal = document.getElementById("textoFinal");
var botonFinal = document.getElementById("botonFinal");
var imgAyuda=document.getElementById("help");
var botonLogin= document.getElementById("botonLogin");
var formularioLogin = document.getElementById("formularioLogin");
var enlaceRegistro = document.getElementById("enlaceRegistro");
var formularioRegistro = document.getElementById("formularioRegistro");

//variables
var letra = new String();
var palabra = new String();
var contadorFallos = 0;
var monedas = 0;
var contadorLetras = 0;
var pista = false;

//listeners
botonClasico.addEventListener("click", jugarClasico);
botonFinal.addEventListener("click", reiniciarPagina);
//evento al presionar la tecla enter
inputLetra.addEventListener("keypress", guardarDatos);
for (boton of botonesCategoria) {
  boton.addEventListener("click", iniciarJuego);
}
imgAyuda.addEventListener("click", darPista);
botonLogin.addEventListener("click", mostrarLogin);
enlaceRegistro.addEventListener("click", mostrarRegistro);

/////////////////////////////////////////////////////////////////////////////

//ocultamos el menú categoría
divElegirCategoria.style.display = "none";
divPalabra.style.display = "none";
divDibujo.style.display = "none";
divMensajeFinal.style.display = "none";
formularioLogin.style.display="none";
formularioRegistro.style.display="none";
function reiniciarPagina() {
  location.reload();
}
function mostrarLogin(){
  botonClasico.style.display="none";
  botonAventura.style.display="none";
  formularioLogin.style.display="block";
}
function mostrarRegistro(){

}
function darPista(){
  for(var i=0; i<spans.length;i++){
    if(spans[i].innerHTML=="" && pista==false){ //este span estará vacío, insertamos la pista
      spans[i].style.border="none"; //quitamos el borde que delimita el hueco
      spans[i].innerHTML=palabra[i]; //la letra que falta en ese hueco está en la misma posición que la posición del span vacío
      pista=true; //ya hemos dado la pista
      contadorLetras++;
      inputLetra.focus();
    }
  }
  //oscurecemos el interrogante y desactivamos el click
  imgAyuda.setAttribute("src", "./img/helpUsado.png");
  imgAyuda.disabled=true;
}
function jugarClasico() {
  //escondemos los botones del menú de inicio
  botonClasico.style.display = "none";
  botonAventura.style.display = "none";
  //mostramos el html del juego
  divElegirCategoria.style.display = "block";
}
function guardarDatos(event) {
  //si el código de la tecla es el del intro
  if (event.keyCode == 13) {
    //recogemos la letra del input
    let texto = inputLetra.value;
    console.log(texto);
    //pasamos la letra a minúscula por si no lo estuviera
    letra = texto.toLowerCase();
    //verificamos si la letra se encuentra en la palabra
    verificarLetra();
  }
}
function verificarLetra() {
  let numeroLetras = 0;

  //nos recorremos la palabra
  for (var i = 0; i < palabra.length; i++) {
    //si la letra pulsada está en ella
    if (letra == palabra.charAt(i)) {
      //pintamos la letra
      pintarLetra(letra, i);
      //contador para mostrar el número de letras encontradas en el mensaje
      numeroLetras++;
      contadorLetras++;

      //sumamos 5 monedas por letra acertada
      monedas += 5;

      if (contadorLetras == palabra.length) {
        inputLetra.disabled=true;
        setTimeout(function() {
          //si tenemos 10 fallos, se acaba el juego
          divMensajeFinal.style.display = "block";
          divPalabra.style.display = "none";
          divDibujo.style.display = "none";
          pTextoFinal.innerHTML = "Has ganado";
          contadorLetras = 0;
          spans = [];
        }, 3000);
      }
    }
  }
  //imprimimos las monedas en el p
  pMonedas.innerHTML = "<img src='./img/coin.png' alt='moneda'> x " + monedas;
  if (numeroLetras == 1) {
    pMensajes.innerHTML =
      "La letra se encuentra " + numeroLetras + " vez en la palabra";
  } else if (numeroLetras > 1) {
    pMensajes.innerHTML =
      "La letra se encuentra " + numeroLetras + " veces en la palabra";
  }
  if (numeroLetras == 0) {
    //si la letra no está
    pMensajes.innerHTML = "Esta letra no se encuentra en la palabra";
    inputLetra.value = "";
    inputLetra.focus();
    divDibujo.style.display = "block";
    divDibujo.addEventListener("change", transicion);
    divDibujo.style.backgroundImage =
      "url('./img/fallo" + contadorFallos + ".png')";
    contadorFallos++;

    pFallos.innerHTML = "FALLO " + contadorFallos + " / 10";

    if (contadorFallos == 10) {
      inputLetra.disabled=true;
      setTimeout(function() {
        //si tenemos 10 fallos, se acaba el juego
        divMensajeFinal.style.display = "block";
        divPalabra.style.display = "none";
        divDibujo.style.display = "none";
        pTextoFinal.innerHTML = "Has perdido";
        contadorLetras = 0;
        spans = [];
      }, 3000);
    }
  }
}

function transicion() {
  // divDibujo.style.opacity=1;
  // divDibujo.style.transition="opacity 0.5s linear";
  // opacity:1;
  // transition:opacity 0.5s linear;
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

function iniciarJuego() {
  //ocultamos las categorias
  divElegirCategoria.style.display = "none";
  //mostramos el footer
  footer[0].style.display = "block";
  //recogemos el tema del select
  let tema = this.id;

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
  divPalabra.style.display = "block";
  //ponemos el foco
  inputLetra.focus();

  //en este momento, el jugador presiona una letra y la tecla enter y se activa el listener keypress que llamará a una función que recoge la letra
  //seguimos a partir del método guardarDatos
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
    case "cine":
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
    case "musica":
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
    case "deporte":
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
