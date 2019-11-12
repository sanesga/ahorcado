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
var imgAyuda = document.getElementById("help");
var enlaceLogin = document.getElementById("enlaceLogin");
var formularioLogin = document.getElementById("formularioLogin");
var enlaceRegistro = document.getElementById("enlaceRegistro");
var formularioRegistro = document.getElementById("formularioRegistro");
var inputLoginName = document.getElementById("inputLoginName");
var inputLoginPassword = document.getElementById("inputLoginPassword");
var inputRegistroName = document.getElementById("inputRegistroName");
var inputRegistroPassword = document.getElementById("inputRegistroPassword");
var inputRegistroPasswordRepeat = document.getElementById(
  "inputRegistroPasswordRepeat"
);
var nombreUsuario = document.getElementById("nombreUsuario");
var botonEntrarLogin = document.getElementById("botonEntrarLogin");
var botonEntrarRegistro = document.getElementById("botonEntrarRegistro");
var logOut = document.getElementById("logOut");

//variables
var letra = new String();
var palabra = new String();
var contadorFallos = 0;
var monedas = 0;
var contadorLetras = 0;
var pista = false;
var usuarios = new Array();
var usuarioActual = new Object();
var usuarioExiste=false;

//listeners
botonClasico.addEventListener("click", jugarClasico);
botonFinal.addEventListener("click", reiniciarPagina);
//evento al presionar la tecla enter
inputLetra.addEventListener("keypress", verificarLetra);
for (boton of botonesCategoria) {
  boton.addEventListener("click", iniciarJuego);
}
imgAyuda.addEventListener("click", darPista);
enlaceLogin.addEventListener("click", mostrarLogin);
enlaceRegistro.addEventListener("click", mostrarRegistro);
botonEntrarLogin.addEventListener("click", login);
botonEntrarRegistro.addEventListener("click", registrarse);
window.addEventListener("beforeunload", cerrarSesion);
logOut.addEventListener("click", cerrarSesion);

/////////////////////////////////////////////////////////////////////////////

//ocultamos el menú categoríacerrarSesion
divElegirCategoria.style.display = "none";
divPalabra.style.display = "none";
divDibujo.style.display = "none";
divMensajeFinal.style.display = "none";
formularioLogin.style.display = "none";
formularioRegistro.style.display = "none";

//obtenemos los datos del local storage
leerDatos();

function reiniciarPagina() {
  location.reload();
}
function cerrarSesion() {
  //al cerrar la pestaña del navegador, guardamos el usuario actual con sus atributos modificados en el array de usuarios y en el local storage
  for (usuario of usuarios) {
    if (usuarioActual.name == usuario.name) { //la clave primaria del objecto usuario es el name, solo podemos modificar las monedas
      usuario.monedas = usuarioActual.monedas;
    }
  }
  // usuarios=[];
guardarUsuarios();

//quitamos el nombre del usuario y el logout del menú
nombreUsuario.innerHTML="usuario";
pMonedas.style.display="none";
}
//nada más entrar a la página cargamos el array de usuarios para trabajar con él
function leerDatos() {
  if (typeof Storage !== "undefined") {
    let json = localStorage.getItem("usuarios");
    usuarios = JSON.parse(json);
  } else {
    alert("tu navegador no soporta el guardado de datos, prueba con otro.");
  }
}

function mostrarLogin() {
  formularioRegistro.style.display = "none";
  botonClasico.style.display = "none";
  botonAventura.style.display = "none";
  formularioLogin.style.display = "block";
  inputLoginName.focus();
}
function mostrarRegistro() {
  formularioLogin.style.display = "none";
  botonClasico.style.display = "none";
  botonAventura.style.display = "none";
  formularioRegistro.style.display = "block";
  inputRegistroName.focus();
}

//entra aquí al darle al botón registrar del formulario de registro
function registrarse() {
  //recogemos los datos del formulario y registramos al usuario
  let registroNombre = inputRegistroName.value;
  let registroPassword = inputRegistroPassword.value;
  let registroPassword2 = inputRegistroPasswordRepeat.value;
  //creamos una clase usuario
  let usuario = new Object();
  usuario.name = registroNombre;
  usuario.password = registroPassword;
  usuario.monedas = 0;
  //añadimos el usuario al array de usuarios
  usuarios.push(usuario);
  //guardamos en local storage (la información no se eliminará nunca, si no la borramos nosotros)
  guardarUsuarios();
  //una vez registrado, vamos a la pantalla de login
  formularioRegistro.style.display = "none";
  formularioLogin.style.display = "block";
  inputLoginName.focus();
}
function guardarUsuarios() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  } else {
    alert("tu navegador no soporta el guardado de datos, prueba con otro.");
  }
}
//entra aquí al hacer click en el botón entrar del formulario de login
function login() {
  
  existeUsuario=false;

  divElegirCategoria.style.display = "none";
  //recogemos los datos
  let loginName = inputLoginName.value;
  let loginPassword = inputLoginPassword.value;

  // console.log(loginName);
  // console.log(loginPassword);

  //verificamos que el usuario esté registrado en la base de datos
  //recuperamos datos
  let json = localStorage.getItem("usuarios");
  usuarios = JSON.parse(json);

  for (usuario of usuarios) {
  // console.log(usuario.name);
  // console.log(usuario.password);
    if (loginName == usuario.name && loginPassword == usuario.password) {
      usuarioActual=usuario;
      nombreUsuario.innerHTML = usuarioActual.name;
      pMonedas.innerHTML="<img src='./img/coin.png' alt='moneda'> x "+ usuarioActual.monedas;
      existeUsuario = true;
    }
  }
  if(!existeUsuario){
    alert("El usuario no existe");
  }

  //volvemos a la pantalla principal
  formularioLogin.style.display = "none";
  botonClasico.style.display = "block";
  botonAventura.style.display = "block";
}

function darPista() {
  for (var i = 0; i < spans.length; i++) {
    if (spans[i].innerHTML == "" && pista == false) {
      //este span estará vacío, insertamos la pista
      spans[i].style.border = "none"; //quitamos el borde que delimita el hueco
      spans[i].innerHTML = palabra[i]; //la letra que falta en ese hueco está en la misma posición que la posición del span vacío
      contadorLetras++;

      // if (contadorLetras == palabra.length) {
      //   inputLetra.disabled = true;
      //   setTimeout(function() {
      //     //si tenemos 10 fallos, se acaba el juego
      //     divMensajeFinal.style.display = "block";
      //     divPalabra.style.display = "none";
      //     divDibujo.style.display = "none";
      //     pTextoFinal.innerHTML = "Has ganado";
      //     contadorLetras = 0;
      //     spans = [];
      //   }, 3000);
      // }

      pista = true; //ya hemos dado la pista
     
      inputLetra.focus();
    }
  }
  //oscurecemos el interrogante y desactivamos el click
  imgAyuda.setAttribute("src", "./img/helpUsado.png");
  imgAyuda.disabled = true;
}
function jugarClasico() {
  //escondemos los botones del menú de inicio
  botonClasico.style.display = "none";
  botonAventura.style.display = "none";
  //mostramos el html del juego
  divElegirCategoria.style.display = "block";
}

function verificarLetra(event) {
  //si el código de la tecla es el del intro
  if (event.keyCode == 13) {
    //recogemos la letra del input
    let texto = inputLetra.value;
    //pasamos la letra a minúscula por si no lo estuviera
    letra = texto.toLowerCase();
    //verificamos si la letra se encuentra en la palabra
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
        //guardamos las monedas en el usuario
        usuarioActual.monedas = monedas;

        if (contadorLetras == palabra.length) {
          inputLetra.disabled = true;
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
        inputLetra.disabled = true;
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
  //seguimos a partir del método verificarLetra
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
