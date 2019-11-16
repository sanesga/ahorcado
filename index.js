//no utilizamos el window.onload ya que cargamos el fichero javascript al final del documento html, de manera que al ejecutarse, la página ya está totalmente cargada

//////////////////////////////////////////////////////////////////////////////
//elementos del dom

//menú
var nombreUsuario = document.getElementById("nombreUsuario");
var botonEntrarLogin = document.getElementById("botonEntrarLogin");
var botonEntrarRegistro = document.getElementById("botonEntrarRegistro");
var logOut = document.getElementById("logOut");
var liLogin = document.getElementById("liLogin");
var liRegistro = document.getElementById("liRegistro");
var inputLoginName = document.getElementById("inputLoginName");
var inputLoginPassword = document.getElementById("inputLoginPassword");
var inputRegistroName = document.getElementById("inputRegistroName");
var inputRegistroPassword = document.getElementById("inputRegistroPassword");
var inputRegistroPasswordRepeat = document.getElementById(
  "inputRegistroPasswordRepeat"
);
var formularioLogin = document.getElementById("formularioLogin");
var formularioRegistro = document.getElementById("formularioRegistro");

//parte 1 --botones clásico y aventura
var parte1 = document.getElementById("parte1");
var botonJugar = document.getElementById("botonJugar");


//parte 2 -- botones categorías
var parte2 = document.getElementById("parte2");
var botonesCategoria = document.getElementsByClassName("categoria");

//parte 3 -- palabra, dibujo, ayuda, huecos, inputletra
var parte3 = document.getElementById("parte3");
var pMensajes = document.getElementById("pMensajes");
var pPalabra = document.getElementById("pPalabra");
var inputLetra = document.getElementById("letra");
var spans = document.getElementsByTagName("span");
var divDibujo = document.getElementById("dibujo");
var pFallos = document.getElementById("fallos");
var imgAyuda = document.getElementById("help");

//parte 4 -- mensaje final
var parte3 = document.getElementById("parte3");
var pTextoFinal = document.getElementById("textoFinal");
var botonFinal = document.getElementById("botonFinal");

//footer -- monedas
var pMonedas = document.getElementById("monedas");

//variables
var letra = new String();
var palabra = new String();
var contadorFallos = 0;
var monedas = 0;
var contadorLetras = 0;
var pista = false;
var usuarios = new Array();
var usuarioActual = new Object();
var usuarioExiste = false;

//listeners
botonJugar.addEventListener("click", jugar);
botonFinal.addEventListener("click", reiniciarJuego);
//evento al presionar la tecla enter
inputLetra.addEventListener("keypress", verificarLetra);
for (boton of botonesCategoria) {
  boton.addEventListener("click", iniciarJuego);
}
imgAyuda.addEventListener("click", darPista);
liLogin.addEventListener("click", mostrarLogin);
liRegistro.addEventListener("click", mostrarRegistro);
botonEntrarLogin.addEventListener("click", login);
botonEntrarRegistro.addEventListener("click", registrarse);

//cuando hacemos click en el botón de log out, cerramos sesión (eliminamos el nombre y el número de monedas de la pantalla);
logOut.addEventListener("click", cerrarSesion);

/////////////////////////////////////////////////////////////////////////////

//ocultamos todos los elementos menos los botones elegir tipo de juego

ocultarElemento(formularioLogin);
ocultarElemento(formularioRegistro);
ocultarElemento(parte2);
ocultarElemento(parte3);
ocultarElemento(parte4);

//obtenemos los datos del local storage
recuperarUsuarios();

//recuperamos el último usuario logueado que no salió de la sesión
recuperarLogin();

//************************************************************FUNCIONES******************************************************/

function jugar() {
  //entramos aquí al hacer click al boton juego clásico
  //escondemos los botones de tipo de juego
  ocultarElemento(parte1);
  //mostramos los botones de categorías
  mostrarElemento(parte2);
}

function reiniciarJuego() {
  //obtenemos todos los spans y los borramos
  eliminarHuecos();
  ocultarElemento(parte4);
  mostrarElemento(parte1);
  //volvemos a activar la ayuda
  imgAyuda.setAttribute("src", "./img/help.png");
  imgAyuda.disabled = false;
  divDibujo.style.backgroundImage = "url('')";
  inputLetra.disabled = false;
}

//----------------------------------------------------------------MENÚ---------------------------------------------------------
function mostrarLogin() {
  ocultarElemento(formularioRegistro);
  ocultarElemento(parte1);
  ocultarElemento(parte2);
  ocultarElemento(parte3);
  ocultarElemento(parte4);
  mostrarElemento(formularioLogin);
  inputLoginName.focus();
}
function mostrarRegistro() {
  ocultarElemento(formularioLogin);
  ocultarElemento(parte1);
  ocultarElemento(parte2);
  ocultarElemento(parte3);
  ocultarElemento(parte4);
  mostrarElemento(formularioRegistro);
  inputRegistroName.focus();
}

/////////////////////////////////////////////////////////////REGISTRO/////////////////////////////////////////////////////////////
function registrarse() {
  var erroresFormularioRegistro = document.getElementById(
    "erroresFormularioRegistro"
  );
  //recogemos los datos del formulario y registramos al usuario
  let registroNombre = inputRegistroName.value;
  let registroPassword = inputRegistroPassword.value;
  let registroPassword2 = inputRegistroPasswordRepeat.value;
  //expresión regular que verifica que la contraseña contenga mínimo 4 carácteres, entre ellos números o letras y solo los carácteres especiales _ y -.
  const regex = /^([a-zA-Z0-9_-]){4,}$/;
  //si las contraseñas coinciden
  if (registroPassword == registroPassword2) {
    if (registroPassword.match(regex)) {
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

      ocultarElemento(formularioRegistro);
      ocultarElemento(formularioLogin);
      ocultarElemento(parte2);
      ocultarElemento(parte3);
      ocultarElemento(parte4);

      mostrarElemento(parte1);
    } else {
      erroresFormularioRegistro.innerHTML =
        "La constraseña debe tener mínimo 4 carácteres (números y/o letras) y solo los carácteres especiales - y _";
      inputRegistroPassword.focus();
    }
  } else {
    erroresFormularioRegistro = document.getElementById(
      "erroresFormularioRegistro"
    );
    erroresFormularioRegistro.innerHTML = "Las contraseñas no coinciden";
    inputRegistroPassword.focus();
  }
}

function guardarUsuarios() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  } else {
    alert(
      "tu navegador no soporta el almacenamiento de datos, prueba con otro."
    );
  }
}
function recuperarUsuarios() {
  //nada más entrar a la página cargamos el array de usuarios para trabajar con él
  if (typeof Storage !== "undefined") {
    let json = localStorage.getItem("usuarios");
    if (json != null) {
      usuarios = JSON.parse(json);
    }
  } else {
    alert(
      "tu navegador no soporta el almacenamiento de datos, prueba con otro."
    );
  }
}
////////////////////////////////////////////////////////FIN REGISTRO////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////LOGIN////////////////////////////////////////////////////////////////////////////
function login() {
  //entra aquí al hacer click en el botón entrar del formulario de login
  existeUsuario = false;
  ocultarElemento(parte2);

  //recogemos los datos
  let loginName = inputLoginName.value;
  let loginPassword = inputLoginPassword.value;

  console.log(loginName);
  console.log(loginPassword);

  //verificamos que el usuario esté registrado en la base de datos
 
  console.log(usuarios);
  for (usuario of usuarios) {
    // console.log(usuario.name)
    if (loginName == usuario.name && loginPassword == usuario.password) {
      usuarioActual = usuario;
      mostrarUsuarioLogueado();
      liRegistro.removeEventListener("click", mostrarRegistro);
      liRegistro.style.backgroundColor = "#abbcd3";
      liLogin.removeEventListener("click", mostrarLogin);
      liLogin.style.backgroundColor = "#abbcd3";
      guardarLogin();
      existeUsuario = true;
    }
  }
  if (!existeUsuario) {
    alert("El usuario no existe");
  }

  //volvemos a la pantalla principal
  ocultarElemento(formularioRegistro);
  ocultarElemento(formularioLogin);
  ocultarElemento(parte2);
  ocultarElemento(parte3);
  ocultarElemento(parte4);
  mostrarElemento(parte1);
}

function guardarLogin() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("usuario", JSON.stringify(usuarioActual));
  } else {
    alert(
      "tu navegador no soporta el almacenamiento de datos, prueba con otro."
    );
  }
}
function recuperarLogin() {
  //nada más entrar a la página cargamos el usuario logueado para trabajar con él (estará guardado el último usuario que se logueó y no hizo log out)
  if (typeof Storage !== "undefined") {
    let json = localStorage.getItem("usuario");
    if (json != null) {
      usuarioActual = JSON.parse(json);
      mostrarUsuarioLogueado();
    }
  } else {
    alert(
      "tu navegador no soporta el almacenamiento de datos, prueba con otro."
    );
  }
}
function mostrarUsuarioLogueado() {
  nombreUsuario.innerHTML = usuarioActual.name;
  pMonedas.innerHTML =
    "<img src='./img/coin.png' alt='moneda'> x " + usuarioActual.monedas;
}
function borrarLogin(){
  localStorage.removeItem("usuario");
}

///////////////////////////////////////////////////////////FIN LOGIN////////////////////////////////////////////////////////////////////////////

function cerrarSesion() {
  //quitamos el nombre del usuario y el logout del menú
  nombreUsuario.innerHTML = "usuario";
  pMonedas.innerHTML = "<img src='./img/coin.png' alt='moneda'> x 0";
  //activamos los botones login y registro del menú
  liRegistro.addEventListener("click", mostrarRegistro);
  liRegistro.style.backgroundColor = "#384A62";
  liLogin.addEventListener("click", mostrarLogin);
  liLogin.style.backgroundColor = "#384A62";

  borrarLogin();
}
//---------------------------------------------------------FIN MENÚ------------------------------------------------------------------------------

function iniciarJuego() {
  //accedemos aquí tras pulsar un botón categoría

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

  //ocultamos las categorias
  ocultarElemento(parte2);
  //mostramos los huecos de la palabra en pantalla
  mostrarHuecos(palabra);
  pMensajes.innerHTML = "Introduce una letra y presiona enter";
  //mostramos el input donde introducir las letras
  parte3.style.display = "inline-block";
  //ponemos el foco
  inputLetra.focus();

  //en este momento, el jugador presiona una letra y la tecla enter y se activa el listener keypress que llamará a una función que recoge la letra
  //seguimos a partir del método verificarLetra
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

        //guardamos las monedas del usuario en el localStorage
        guardarMonedas();

        if (contadorLetras == palabra.length) {
          inputLetra.disabled = true;
          setTimeout(function() {
            //si tenemos 10 fallos, se acaba el juego
            mostrarElemento(parte4);
            ocultarElemento(parte3);
            pTextoFinal.innerHTML = "Has ganado";
            contadorLetras = 0;
          }, 3000);
        }
      }
    }
    //imprimimos las monedas en el p
    pMonedas.innerHTML = "<img src='./img/coin.png' alt='moneda'> x " + usuarioActual.monedas;
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
      parte3.style.display = "inline-block";
      //divDibujo.addEventListener("change", transicion);
      divDibujo.style.backgroundImage =
        "url('./img/fallo" + contadorFallos + ".png')";
      contadorFallos++;

      pFallos.innerHTML = "FALLO " + contadorFallos + " / 10";

      if (contadorFallos == 10) {
        inputLetra.disabled = true;
        setTimeout(function() {
          //si tenemos 10 fallos, se acaba el juego
          ocultarElemento(parte3);
          mostrarElemento(parte4);
          pTextoFinal.innerHTML = "Has perdido";
          contadorLetras = 0;
          spans = [];
        }, 3000);
      }
    }
  }
}

function darPista() {
  for (var i = 0; i < spans.length; i++) {
    if (spans[i].innerHTML == "" && pista == false) {
      //este span estará vacío, insertamos la pista
      spans[i].style.border = "none"; //quitamos el borde que delimita el hueco
      spans[i].innerHTML = palabra[i]; //la letra que falta en ese hueco está en la misma posición que la posición del span vacío
      contadorLetras++;
      pista = true; //ya hemos dado la pista
    }
  }
  //oscurecemos el interrogante y desactivamos el click
  imgAyuda.setAttribute("src", "./img/helpUsado.png");
  imgAyuda.disabled = true;
  inputLetra.focus();

  if (contadorLetras == palabra.length) {
    inputLetra.disabled = true;
    setTimeout(function() {
      //si tenemos 10 fallos, se acaba el juego
      mostrarElemento(parte4);
      ocultarElemento(parte3);
      pTextoFinal.innerHTML = "Has ganado";
      contadorLetras = 0;
    }, 3000);
  }
}

function transicion() {
  // divDibujo.style.opacity=1;
  // divDibujo.style.transition="opacity 0.5s linear";
  // opacity:1;
  // transition:opacity 0.5s linear;
}

function guardarMonedas(){
  //guardamos las monedas del usuario en el local storage (así si hacemos reload sin querer o log out, ya estarán guardadas)
 
 //guardamos en el array de usuarios
  for (usuario of usuarios) {
    if (usuarioActual.name == usuario.name) {
      //la clave primaria del objecto usuario es el name, solo podemos modificar las monedas
      usuario.monedas = usuarioActual.monedas;
    }
  }
  guardarUsuarios();

  //guardamos en el usuario logueado
  guardarLogin();
}

/////////////////////////////////////////////FUNCIONES GENÉRICAS////////////////////////////////////
function mostrarHuecos(palabra) {
  for (var i = 0; i < palabra.length; i++) {
    var span = document.createElement("span");
    span.setAttribute("class", "letras");
    pPalabra.appendChild(span);
  }
}

function eliminarHuecos() {
  var huecos = document.getElementsByClassName("letras");
  let longitud = huecos.length;
  for (var j = 0; j < longitud; j++) {
    pPalabra.removeChild(huecos[0]);
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
function ocultarElemento(elemento) {
  elemento.style.display = "none";
}
function mostrarElemento(elemento) {
  elemento.style.display = "block";
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
////////////////////////////////////////////////////////////////////FIN FUNCIONES GENÉRICAS/////////////////////////////////////////
