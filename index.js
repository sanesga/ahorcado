//no utilizamos el window.onload ya que cargamos el fichero javascript al final del documento html, de manera que al ejecutarse, la página ya está totalmente cargada
//para evitar hacer varias páginas, la maquetación es en un html y se van mostrando y ocultando elementos

//ABRIR LA CONSOLA PARA VER LA PALABRA

//////////////////////////////////////////////////////////////////////////////

//ELEMENTOS DEL DOM

//div que engloba el body
var divContainer = document.getElementById("container");

//menú
var nombreUsuario = document.getElementById("nombreUsuario");
var botonEntrarLogin = document.getElementById("botonEntrarLogin");
var botonEntrarRegistro = document.getElementById("botonEntrarRegistro");
var logOut = document.getElementById("logOut");
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
var liHome = document.getElementById("liHome");

//parte 1 --botón login
var parte1 = document.getElementById("parte1");
var btnLogin = document.getElementById("btnLogin");

//parte 2 -- botones categorías y sus precios
var parte2 = document.getElementById("parte2");
var botonesCategoria = document.getElementsByClassName("categoria");
var prices = document.getElementsByClassName("price");

//parte 3 -- palabra, dibujo, ayuda, huecos, inputletra
var parte3 = document.getElementById("parte3");
var pMensajes = document.getElementById("pMensajes");
var pPalabra = document.getElementById("pPalabra");
var inputLetra = document.getElementById("letra");
var spans = document.getElementsByClassName("letras");
var divDibujo = document.getElementById("dibujo");
var pFallos = document.getElementById("fallos");
var imgAyuda = document.getElementById("help");

//parte 4 -- mensaje final (ganar o perder) y botón reiniciar juego
var parte3 = document.getElementById("parte3");
var pTextoFinal = document.getElementById("textoFinal");
var botonFinal = document.getElementById("botonFinal");

//footer -- monedas
var footer = document.getElementsByTagName("footer");
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
var espacios = new Number();
var posicionPalabra = new Number();

//listeners
botonFinal.addEventListener("click", reiniciarJuego);
//evento al presionar la tecla enter
inputLetra.addEventListener("keypress", verificarLetra);
imgAyuda.addEventListener("click", darPista);
btnLogin.addEventListener("click", mostrarLogin);
liRegistro.addEventListener("click", mostrarRegistro);
botonEntrarLogin.addEventListener("click", login);
botonEntrarRegistro.addEventListener("click", registrarse);
liHome.addEventListener("click", irAHome);
logOut.addEventListener("click", cerrarSesion);
for (boton of botonesCategoria) {
  boton.addEventListener("click", iniciarJuego);
}
/////////////////////////////////////////////////////////////////////////////

//INICIO DEL CÓDIGO

//ocultamos todos los elementos menos el botón de login
ocultarElemento(formularioLogin);
ocultarElemento(formularioRegistro);
ocultarElemento(parte2);
ocultarElemento(parte3);
ocultarElemento(parte4);
ocultarElemento(footer[0]);

//obtenemos los datos del local storage
recuperarUsuarios();

//recuperamos el último usuario logueado que no salió de la sesión. Si no hay contacto logueado, se muestra el botón de login.
recuperarLogin();

//************************************************************FUNCIONES******************************************************/

//--------------------------------------------MENÚ-------------------------------------------------
//al hacer click en el botón home del menú
function irAHome() {
  //si no hay usuario logueado, se muestra el login
  if (usuarioActual == null) {
    ocultarElemento(formularioLogin);
    ocultarElemento(formularioRegistro);
    ocultarElemento(parte2);
    ocultarElemento(parte3);
    ocultarElemento(parte4);

    mostrarElemento(parte1);

    //si hay usuario logueado, se muestran las categorías y se reinician todos los campos
  } else {
    ocultarElemento(formularioLogin);
    ocultarElemento(formularioRegistro);
    ocultarElemento(parte1);
    ocultarElemento(parte3);
    ocultarElemento(parte4);

    mostrarElemento(parte2);

    reiniciarJuego();
  }
}
//al hacer click sobre el botón registro, se muestra el formulario de registro
function mostrarRegistro() {
  ocultarElemento(formularioLogin);
  ocultarElemento(parte1);
  ocultarElemento(parte2);
  ocultarElemento(parte3);
  ocultarElemento(parte4);

  mostrarElemento(formularioRegistro);

  inputRegistroName.focus();
}

//al hacer click sobre el botón de log out, cerramos sesión
function cerrarSesion() {

  mostrarElemento(parte1);
  ocultarElemento(parte2);
  ocultarElemento(footer[0]);
  ocultarElemento(parte3);
  ocultarElemento(formularioLogin);
  ocultarElemento(formularioRegistro);

  //borramos el usuario actual
  usuarioActual = null;
  //quitamos el nombre del usuario y el logout del menú
  nombreUsuario.innerHTML = "usuario";
  //activamos los botones login y registro del menú
  liRegistro.addEventListener("click", mostrarRegistro);
  liRegistro.style.backgroundColor = "#384A62";

  //volvemos a poner el fondo original
  divContainer.style.backgroundImage = "url('./img/background.jpg')";

  //reseteamos todos los campos
  reiniciarJuego();

  //borramos los datos de sesión del usuario del local storage
  borrarLogin();
}

//al hacer click en el botón de login, se muestra el formulario de login
function mostrarLogin() {

  ocultarElemento(formularioRegistro);
  ocultarElemento(parte1);
  ocultarElemento(parte2);
  ocultarElemento(parte3);
  ocultarElemento(parte4);

  mostrarElemento(formularioLogin);
  //ponemos el foco en el input del nombre
  inputLoginName.focus();
}

/////////////////////////////////////////////////////////////REGISTRO/////////////////////////////////////////////////////////////
function registrarse() {

  //elemento donde imprimimos los mensajes de error durante el registro
  var erroresFormularioRegistro = document.getElementById(
    "erroresFormularioRegistro"
  );
  //recogemos los datos del formulario
  let registroNombre = inputRegistroName.value;
  let registroPassword = inputRegistroPassword.value;
  let registroPassword2 = inputRegistroPasswordRepeat.value;

  //verificamos que el nombre no esté en uso
  let nombreValido = validarNombreUsuario(registroNombre);

  //si el nombre es único
  if (nombreValido) {
    
    //expresión regular que verifica que la contraseña contenga mínimo 4 carácteres, entre ellos números o letras y solo los carácteres especiales _ y -.
    const regex = /^([a-zA-Z0-9_-]){4,}$/;

    //si las contraseñas coinciden
    if (registroPassword == registroPassword2) {

      // y coinciden con el patrón
      if (registroPassword.match(regex)) {

        //creamos una clase usuario
        let usuario = new Object();
        usuario.name = registroNombre;
        usuario.password = registroPassword;
        usuario.monedas = 0;
        usuario.palabra = 0;
        usuario.categoria = new Array();

        //añadimos el usuario al array de usuarios
        usuarios.push(usuario);

        //lo guardamos en local storage (la información no se eliminará nunca, si no la borramos nosotros)
        guardarUsuarios();

        //una vez registrado, vamos a la pantalla de login
        ocultarElemento(formularioRegistro);
        ocultarElemento(formularioLogin);
        ocultarElemento(parte2);
        ocultarElemento(parte3);
        ocultarElemento(parte4);

        mostrarElemento(parte1);

        //ERRORES (ponemos el foco en el input de error para facilitar el cambio)
      } else {
        erroresFormularioRegistro.innerHTML =
          "La constraseña debe tener mínimo 4 carácteres (números y/o letras) y solo los carácteres especiales - y _";
        inputRegistroPassword.focus();
      }
    } else {
      erroresFormularioRegistro.innerHTML = "Las contraseñas no coinciden";
      inputRegistroPassword.focus();
    }
  } else {
    erroresFormularioRegistro.innerHTML =
      "Este nombre de usuario ya está en uso, elige otro";
      inputRegistroName.focus();
  }
}
//comprueba que el nombre de usuario sera único (clave primaria)
function validarNombreUsuario(registroNombre) {
  //recorremos el array usuarios
  for (u of usuarios) {
    //si el nombre de algún usuario es igual al que hemos elegido, mostramos un mensaje de error
    if (registroNombre == u.name) {
      return false;
    }
  }
  //si el nombre es único
  return true;
}

//guardamos los usuarios en el local storage
function guardarUsuarios() {
  //si nuestro navegador soporta el almacenamiento en el local storage
  if (typeof Storage !== "undefined") {
    //guardamos en formato JSON
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    //si no lo admite
  } else {
    alert(
      "tu navegador no soporta el almacenamiento de datos, prueba con otro."
    );
  }
}
//nada más entrar a la página cargamos el array de usuarios desde el local storage para trabajar con él
function recuperarUsuarios() {
  if (typeof Storage !== "undefined") {
    let json = localStorage.getItem("usuarios");
    if (json != null) {
      //hacemos un parse de JSON a array
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

//entra aquí al hacer click en el botón entrar del formulario de login
function login() {
  
  existeUsuario = false;
  ocultarElemento(parte2);

  //recogemos los datos del formulario
  let loginName = inputLoginName.value;
  let loginPassword = inputLoginPassword.value;

  //verificamos que el usuario esté registrado en la base de datos
  for (usuario of usuarios) {

   //si el nombre y la contraseña introducidos corresponden con el nombre y la contraseña de algún usuario de la bd
    if (loginName == usuario.name && loginPassword == usuario.password) {

      //nos guardamos el usuario, en usuario actual para trabajar con él durante el juego y guardar los cambios
      usuarioActual = usuario;

      //pintamos los datos del usuario en el juego (nombre, monedas..)
      mostrarUsuarioLogueado();

      //evitamos poder hacer click a registro
      liRegistro.removeEventListener("click", mostrarRegistro);
      liRegistro.style.backgroundColor = "#abbcd3";

      //guardamos el usuario como usuario logueado en la sesión
      guardarLogin();

      existeUsuario = true;

      //mostramos las categorías
      ocultarElemento(formularioRegistro);
      ocultarElemento(formularioLogin);
      ocultarElemento(parte1);
      ocultarElemento(parte3);
      ocultarElemento(parte4);
      mostrarElemento(parte2);
      mostrarElemento(footer[0]);
    }
  }
  if (!existeUsuario) {
    alert("El usuario no existe");
  }
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
//al cargar la página cargamos el usuario logueado para trabajar con él (estará guardado el último usuario que se logueó y no hizo log out)
function recuperarLogin() {
  
  if (typeof Storage !== "undefined") {
    let json = localStorage.getItem("usuario");
    if (json != null) {
      usuarioActual = JSON.parse(json);

      mostrarUsuarioLogueado();

      //mostramos las categorías
      ocultarElemento(parte1);
      mostrarElemento(parte2);
      mostrarElemento(footer[0]);

      liRegistro.removeEventListener("click", mostrarRegistro);
      liRegistro.style.backgroundColor = "#abbcd3";
      //volvemos a activar la ayuda

      imgAyuda.setAttribute("src", "./img/help.png");
      pista = false;
      imgAyuda.disabled = false;

    } //si no hay usuario logueado, se muestra por defecto el botón login. Siempre que se accede al juego, habrá un usuario logueado.
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
  //leemos las categorias que tiene compradas el usuario

  for (var i = 0; i < usuarioActual.categoria.length; i++) {
    ocultarElemento(prices[i]);
  }
}
function borrarLogin() {
  localStorage.removeItem("usuario");
}

///////////////////////////////////////////////////////////FIN LOGIN////////////////////////////////////////////////////////////////////////////

//--------------------------------------FIN MENÚ-------------------------------------------------------

function iniciarJuego() {
  //accedemos aquí tras pulsar un botón categoría

  //recogemos el tema del select
  let tema = this.id;

  let comprado = verificarSiComprado(tema);

  //si la categoría no está comprada, la intentamos comprar
  if (!comprado) {
    let pagado = comprar(tema);

    if (pagado) {
      jugar(tema);
    } else {
      alert(
        "No tienes suficientes monedas para desbloquear el nivel. Sigue jugando para ganar más monedas."
      );
    }
  } else {
    //si ya está comprada
    jugar(tema);
  }
}

function jugar(tema) {
  //elegimos array según tema
  var arrayTema = crearArray(tema);
  console.log(usuarioActual.palabra);
  //obtenemos la palabra
  palabra = arrayTema[usuarioActual.palabra];
  //ayuda para el desarrollo
  console.log(palabra);
  //ponemos a 0 el contador de espacios en blanco
  espacios = 0;
  //guardamos el número de espacios en blanco que contiene para que no se cuenten cuando vayamos acertando letras
  contarEspaciosBlanco();
  //sumamos los espacios al contador de letras para que no se cuenten al acertar las letras
  contadorLetras += espacios;

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
// function numeroAleatorio(){
//   return Math.floor(Math.random()*10);
// }
function verificarSiComprado(tema) {
  var posicion = new Number();

  switch (tema) {
    case "peliculas":
      posicion = 0;
      return true;
      break;
    case "cantantes":
      posicion = 1;
      break;
    case "animales":
      posicion = 2;
      break;
    case "alimentos":
      posicion = 3;
      break;
    case "ciudades":
      posicion = 4;
      break;
  }
  //recorremos las categorias compradas
  for (c of usuarioActual.categoria) {
    //si la categoria a la que hemos hecho click, se encuentra en el array de categorías compradas
    if (c == posicion) {
      //devolvemos true
      return true;
    }
  }
  //si no está comoprada, devolvemos false
  return false;
}
function comprar(tema) {
  var credito = usuarioActual.monedas;

  switch (tema) {
    case "peliculas":
      return true;
      break;
    case "cantantes":
      if (credito >= 50) {
        //le restamos las monedas que se ha gastado
        usuarioActual.monedas -= 50;
        //quitamos el precio
        ocultarElemento(prices[0]);
        //guardamos que la categoría está comprada
        usuarioActual.categoria.push(1);
        guardarUsuario();
        return true;
      }
      break;
    case "animales":
      if (credito >= 100) {
        //le restamos las monedas que se ha gastado
        usuarioActual.monedas -= 100;
        ocultarElemento(prices[1]);
        usuarioActual.categoria.push(2);
        guardarUsuario();
        return true;
      }
      break;
    case "alimentos":
      if (credito >= 150) {
        //le restamos las monedas que se ha gastado
        usuarioActual.monedas -= 150;
        ocultarElemento(prices[2]);
        usuarioActual.categoria.push(3);
        guardarUsuario();
        return true;
      }
      break;
    case "ciudades":
      if (credito >= 200) {
        //le restamos las monedas que se ha gastado
        usuarioActual.monedas -= 200;
        ocultarElemento(prices[3]);
        usuarioActual.categoria.push(4);
        guardarUsuario();
        return true;
      }
      break;
  }
  return false;
}

function contarEspaciosBlanco() {
  for (var i = 0; i < palabra.length; i++) {
    if (palabra.charAt(i) == " ") {
      espacios++;
    }
  }
}

function verificarLetra(event) {
  //accedemos aquí tras introducir una letra y pulsar intro
  //si el código de la tecla es el del intro
  if (event.keyCode == 13) {
    //recogemos la letra del input
    let texto = inputLetra.value;

    //si la letra no es un espacio en blanco, procedemos
    if (texto != " ") {
      //pasamos la letra a minúscula por si no lo estuviera
      letra = texto.toLowerCase();
      //verificamos si la letra se encuentra en la palabra
      let numeroLetras = 0;

      //nos recorremos la palabra
      for (var i = 0; i < palabra.length; i++) {
        //si la letra pulsada está en ella y no se ha pintado ya, si se repite la letra, se cuenta como fallo.

        if (letra == palabra.charAt(i) && spans[i].innerHTML == "") {
          //pintamos la letra
          pintarLetra(letra, i);
          //contador para mostrar el número de letras encontradas en el mensaje
          numeroLetras++;
          //contador para contar las letras que llevamos acertadas
          contadorLetras++;
          // console.log(contadorLetras);
          //sumamos 5 monedas por letra acertada
          monedas += 5;
          //guardamos las monedas en el usuario
          usuarioActual.monedas = monedas;

          //guardamos el usuario en local storage con las monedas actualizadas
          guardarUsuario();

          if (contadorLetras == palabra.length) {
            inputLetra.disabled = true;
            setTimeout(function() {
              mostrarElemento(parte4);
              ocultarElemento(parte3);
              pTextoFinal.innerHTML = "Has acertado";
              contadorLetras = 0;
              contadorFallos = 0;
              pFallos.innerHTML = "FALLO 0 / 10";
              //incrementamos la posicion de la palabra del usuario actual
              usuarioActual.palabra++;
              guardarUsuario();
              //guardamos el usuario en el local storage con la posición de la palabra actualizada

              //si se han terminado las palabras
              if (usuarioActual.palabra == 10) {
                //reiniciamos el contador palabras
                usuarioActual.palabra = 0;
                guardarUsuario();
              }
              guardarUsuario();
            }, 3000);
          }
        }
      }
      //imprimimos las monedas en el p
      pMonedas.innerHTML =
        "<img src='./img/coin.png' alt='moneda'> x " + usuarioActual.monedas;
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
            pTextoFinal.innerHTML = "Has fallado";
            contadorLetras = 0;
            contadorFallos = 0;
            pFallos.innerHTML = "FALLO 0 / 10";
            eliminarHuecos();
          }, 3000);
        }
      }
    } //si la letra es un espacio en blanco
  }
}

function darPista() {
  // console.log("entra a dar pista");
  for (var i = 0; i < spans.length; i++) {
    if (!pista && palabra[i] != " " && spans[i].innerHTML == "") {
      var letraPista = palabra[i];
      // console.log("pista "+pista);
      pista = true; //ya hemos dado la pista
      pintarPista(letraPista);
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
function pintarPista(letraPista) {
  // console.log(letraPista);
  //controlamos si hay más de una letra de ese tipo
  for (var i = 0; i < palabra.length; i++) {
    if (letraPista == palabra.charAt(i)) {
      spans[i].style.border = "none";
      spans[i].innerHTML = letraPista.toUpperCase();
      contadorLetras++;
    }
  }
}

function guardarUsuario() {
  //guardamos las monedas del usuario en el local storage (así si hacemos reload sin querer o log out, ya estarán guardadas)

  //guardamos en el array de usuarios
  for (usuario of usuarios) {
    if (usuarioActual.name == usuario.name) {
      //la clave primaria del objecto usuario es el name, solo podemos modificar las monedas
      usuario.monedas = usuarioActual.monedas;
      usuario.palabra = usuarioActual.palabra;
      usuario.categoria = usuarioActual.categoria;
    }
  }
  guardarUsuarios();

  //guardamos en el usuario logueado
  guardarLogin();
}

/////////////////////////////////////////////FUNCIONES GENÉRICAS////////////////////////////////////
function reiniciarJuego() {
  //obtenemos todos los spans y los borramos
  eliminarHuecos();
  divDibujo.style.backgroundImage = "url('')";
  inputLetra.disabled = false;
  //volvemos a activar la ayuda
  imgAyuda.setAttribute("src", "./img/help.png");
  pista = false;
  imgAyuda.disabled = false;
  contadorFallos = 0;
  pFallos.innerHTML = "FALLO 0 / 10";
  contadorLetras = 0;
}

function mostrarHuecos(palabra) {
  for (var i = 0; i < palabra.length; i++) {
    var span = document.createElement("span");
    span.setAttribute("class", "letras");
    pPalabra.appendChild(span);

    //si el hueco corresponde a un espacio en blanco, quitamos el borde
    if (palabra[i] == " ") {
      span.style.border = "none";
    }
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

//DEJAMOS SOLO 3 PALABRAS DE CADA PARA PODER PROBAR EL JUEGO RÁPIDAMENTE
function crearArray(tema) {
  switch (tema) {
    case "peliculas":
      divContainer.style.backgroundImage = "url('./img/cine.jpg')";
      return (animales = [
        "titanic",
        "matrix",
        "avatar",
        "volver",
        "kill bill",
        "el resplandor",
        "el lobo de wall street",
        "el jocker",
        "it",
        "jurassic park"
      ]);
      break;
    case "cantantes":
      divContainer.style.backgroundImage = "url('./img/musica.jpg')";
      return (alimentos = [
        "rosalia",
        "miley cyrus",
        "rihanna",
        "shakira",
        "lady gaga",
        "dua lipa",
        "bad bunny",
        "ed sheeran",
        "katy perry",
        "thalia"
      ]);
      break;
    case "alimentos":
      divContainer.style.backgroundImage = "url('./img/alimentos.jpg')";
      return (ciudades = [
        "arroz",
        "pasta",
        "azucar",
        "pan",
        "leche",
        "cereales",
        "patata",
        "chocolate",
        "cafe",
        "lechuga"
      ]);
      break;
    case "animales":
      divContainer.style.backgroundImage = "url('./img/animales.jpg')";
      return (ciudades = [
        "jirafa",
        "oso",
        "elefante",
        "cocodrilo",
        "gato",
        "pez",
        "canario",
        "perro",
        "rata",
        "lombriz"
      ]);
      break;
    case "ciudades":
      divContainer.style.backgroundImage = "url('./img/ciudades.jpg')";
      return (ciudades = [
        "madrid",
        "valencia",
        "alicante",
        "castellon",
        "barcelona",
        "cordoba",
        "santander",
        "sevilla",
        "granada",
        "bilbao"
      ]);
      break;
  }
}
////////////////////////////////////////////////////////////////////FIN FUNCIONES GENÉRICAS/////////////////////////////////////////
