/* ==========================================================================
   INTERACTIVIDAD Y LÓGICA DE NAVEGACIÓN COMPLETA
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. SELECCIÓN DE ELEMENTOS PRINCIPALES
// --------------------------------------------------------------------------
// Guardamos en constantes las referencias al botón hamburguesa y a la lista principal.
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');


// --------------------------------------------------------------------------
// 2. FUNCIÓN AUXILIAR: CERRAR SUBMENÚS (RESPETANDO JERARQUÍA PADRE / HIJO)
// --------------------------------------------------------------------------
/*
   EXPLICACIÓN PEDAGÓGICA SOBRE EL PARÁMETRO (excepcionBoton = null):
   
   1. ¿Por qué no se declaró antes?
      No hace falta declararlo afuera con let o const. "excepcionBoton" se crea 
      automáticamente dentro de los paréntesis () como un parámetro local de la función.
      
   2. ¿Qué significa "= null"?
      Es un "valor por defecto". Si llamamos a la función VACÍA como 
      cerrarTodosLosSubmenus(), JavaScript le asigna automáticamente null a la variable.
      
   3. Comportamiento en la práctica:
      - Si se llama VACÍA `cerrarTodosLosSubmenus()` -> excepcionBoton vale null. 
        Ningún botón coincide con null, así que CIERRA ABSOLUTAMENTE TODO.
      - Si se llama CON UN BOTÓN `cerrarTodosLosSubmenus(boton)` -> excepcionBoton 
        recibe ese botón exacto y, gracias a .contains(), evita cerrarlo a él ni a sus menús padres.
*/
function cerrarTodosLosSubmenus(excepcionBoton = null) {
  // querySelectorAll selecciona dinámicamente TODOS los botones y submenús usando sus clases CSS
  const todosLosBotones = document.querySelectorAll('.dropdown-btn, .dropdown-subbtn');
  const todosLosSubmenus = document.querySelectorAll('.submenu, .sub-submenu');

  todosLosBotones.forEach(boton => {
    // Si el botón no es la excepción y tampoco es un botón padre de la excepción, le quita la clase 'open'
    if (boton !== excepcionBoton && !boton.contains(excepcionBoton)) {
      boton.classList.remove('open');
    }
  });

  todosLosSubmenus.forEach(menu => {
    // Si el submenú no es la excepción y tampoco contiene al botón activo, se oculta
    if (menu !== excepcionBoton && !menu.contains(excepcionBoton)) {
      menu.classList.remove('open');
    }
  });
}


// --------------------------------------------------------------------------
// 3. EVENTO MENÚ HAMBURGUESA
// --------------------------------------------------------------------------
hamburgerBtn.addEventListener('click', () => {
  // .toggle() funciona como un interruptor: agrega la clase si no está, la quita si ya está
  hamburgerBtn.classList.toggle('active');
  navMenu.classList.toggle('active');
  hamburgerBtn.setAttribute('aria-expanded', navMenu.classList.contains('active'));

  // Si el usuario cierra el menú hamburguesa completo, se llama a la función VACÍA 
  // para que cierre TODOS los submenús sin excepción (excepcionBoton = null)
  if (!navMenu.classList.contains('active')) {
    cerrarTodosLosSubmenus();
  }
});


// --------------------------------------------------------------------------
// 4. EVENTO PARA SUBMENÚS NIVEL 1 (.dropdown-btn) -> "Servicios", "Proyectos"
// --------------------------------------------------------------------------
document.querySelectorAll('.dropdown-btn').forEach(boton => {
  boton.addEventListener('click', (e) => {
    /* 
       e.preventDefault(): Cancela la acción por defecto del enlace <a href="#">.
       Evita que la página dé un salto brusco hacia arriba al hacer clic.
    */
    e.preventDefault();

    // nextElementSibling accede a la lista .submenu que es hermana directa en el HTML
    const submenuAsociado = boton.nextElementSibling; 
    const estaAbierto = submenuAsociado.classList.contains('open');

    // Enviamos "boton" como parámetro para que la función SEPA cuál no debe cerrar
    cerrarTodosLosSubmenus(boton);

    // Abre o cierra el submenú correspondiente
    if (!estaAbierto) {
      boton.classList.add('open');
      submenuAsociado.classList.add('open');
    } else {
      boton.classList.remove('open');
      submenuAsociado.classList.remove('open');
    }
  });
});


// --------------------------------------------------------------------------
// 5. EVENTO PARA SUBMENÚS NIVEL 2 (.dropdown-subbtn) -> "Desarrollo Web"
// --------------------------------------------------------------------------
document.querySelectorAll('.dropdown-subbtn').forEach(subBoton => {
  subBoton.addEventListener('click', (e) => {
    // Cancelamos la navegación del enlace de 2º nivel
    e.preventDefault();

    const subSubmenuAsociado = subBoton.nextElementSibling; // Encuentra la lista hermana .sub-submenu
    const estaAbierto = subSubmenuAsociado.classList.contains('open');

    // Enviamos "subBoton" para que mantenga abierto este botón y a su menú padre "Proyectos"
    cerrarTodosLosSubmenus(subBoton);

    // Muestra u oculta las opciones de "Front-End" y "Back-End"
    if (!estaAbierto) {
      subBoton.classList.add('open');
      subSubmenuAsociado.classList.add('open');
    } else {
      subBoton.classList.remove('open');
      subSubmenuAsociado.classList.remove('open');
    }
  });
});


// --------------------------------------------------------------------------
// 6. CERRAR TODO (MENÚ HAMBURGUESA Y SUBMENÚS) AL HACER CLIC FUERA
// --------------------------------------------------------------------------
document.addEventListener('click', (e) => {
  /*
     e.target.closest('.navbar'): Busca si el elemento clickeado está DENTRO de .navbar.
     El símbolo '!' (negación) evalúa si el clic ocurrió FUERA de la barra de navegación.
  */
  if (!e.target.closest('.navbar')) {

    // 1. Oculta la lista desplegable del menú principal en móvil
    navMenu.classList.remove('active');

    // 2. Le quita la animación a la 'X' para restaurar las 3 rayitas de la hamburguesa
    hamburgerBtn.classList.remove('active');

    // 3. Cierra todos los submenús de nivel 1 y nivel 2 (llamada vacía = sin excepciones)
    cerrarTodosLosSubmenus();
  }
});


// --------------------------------------------------------------------------
// 7. CERRAR EL MENÚ AL ELEGIR UN ENLACE REAL (no los botones que abren submenús)
// --------------------------------------------------------------------------
document.querySelectorAll('.nav-menu a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    if (enlace.classList.contains('dropdown-btn') || enlace.classList.contains('dropdown-subbtn')) return;
    navMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    cerrarTodosLosSubmenus();
  });
});

// Tecla Escape: cierra submenús y menú
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    cerrarTodosLosSubmenus();
  }
});


/* 
  ====================================================================
  CONTROL DE ACCESO, CARRUSEL DE DOCENTES Y FORMULARIOS - CBTis 166
  ==================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica del Formulario de Login (Alumnos)
    const formularioLogin = document.getElementById('form-login');

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = document.getElementById('usuario').value;
            alert(`¡Acceso concedido!\nBienvenido al sistema escolar, usuario: ${usuario}`);
            formularioLogin.reset();
        });
    }

    // 2. Lógica de los Botones y Arrastre del Carrusel de Docentes
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const teachersTrack = document.getElementById('teachers-track');

    if (btnPrev && btnNext && teachersTrack) {
        
        // Función para calcular el ancho de desplazamiento al hacer clic en las flechas
        const getScrollAmount = () => {
            const card = teachersTrack.querySelector('.teacher-card');
            if (!card) return 320;
            return card.offsetWidth + 24; // Ancho de la tarjeta + la separación (gap)
        };

        // Evento para el botón derecho (siguiente)
        btnNext.addEventListener('click', () => {
            teachersTrack.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        // Evento para el botón izquierdo (anterior)
        btnPrev.addEventListener('click', () => {
            teachersTrack.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        // --- ARRASTRE SUAVE CON EL MOUSE ---
        let isDown = false;
        let startX;
        let scrollLeft;

        teachersTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - teachersTrack.offsetLeft;
            scrollLeft = teachersTrack.scrollLeft;
            teachersTrack.style.scrollBehavior = 'auto'; // Desactiva el smooth temporalmente para respuesta inmediata con el mouse
        });

        window.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            teachersTrack.style.scrollBehavior = 'smooth'; // Restaura el desplazamiento suave
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - teachersTrack.offsetLeft;
            const walk = (x - startX) * 1.5; // Velocidad de arrastre proporcional
            teachersTrack.scrollLeft = scrollLeft - walk;
        });
    }

    // 3. Lógica para el Formulario de Solicitud de Informes (Index Hero)
    const formularioHero = document.getElementById('form-hero-informes');

    if (formularioHero) {
        formularioHero.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreUsuario = document.getElementById('info_nombre').value;
            alert(`¡Gracias por tu interés, ${nombreUsuario}!\nTus datos han sido enviados con éxito. Nos pondremos en contacto contigo pronto desde el CBTis 166.`);
            formularioHero.reset();
        });
    }

});