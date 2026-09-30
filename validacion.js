// ===== Elementos de la página =====
var form = document.getElementById("inscripcion");
var campoSede = document.getElementById("campo-sede");
var fuerza = document.getElementById("fuerza");
var contador = document.getElementById("contador");
var confirmacion = document.getElementById("confirmacion");

// Aquí voy a guardar los campos que el usuario ya visitó
var tocados = {};

// reglas
// Cada regla recibe el valor del campo
// Si está bien devuelve true, si está mal devuelve el mensaje de error
var reglas = {
  nombre: function (valor) {
    valor = valor.trim();
    var soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+( [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
    if (valor.length >= 5 && valor.length <= 60 && soloLetras.test(valor)) {
      return true;
    }
    return "Escribe tu nombre y apellido.";
  },

  cedula: function (valor) {
    var formato = /^([1-9]|1[0-3]|PE|E|N)-\d{1,4}-\d{1,6}$/;
    if (formato.test(valor.trim())) {
      return true;
    }
    return "Usa el formato 8-123-4567.";
  },

  correo: function (valor) {
    var formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formato.test(valor.trim())) {
      return true;
    }
    return "Usa un correo como nombre@dominio.com.";
  },

  celular: function (valor) {
    var formato = /^6\d{3}-?\d{4}$/;
    if (formato.test(valor.trim())) {
      return true;
    }
    return "El celular debe tener 8 dígitos y empezar con 6.";
  },

  nacimiento: function (valor) {
    if (valor === "") {
      return "Debes tener al menos 16 años.";
    }
    var fecha = new Date(valor);
    var hoy = new Date();
    if (fecha > hoy) {
      return "La fecha no puede ser futura.";
    }
    var limite = new Date();
    limite.setFullYear(limite.getFullYear() - 16);
    if (fecha > limite) {
      return "Debes tener al menos 16 años.";
    }
    return true;
  },

  curso: function (valor) {
    if (valor === "") {
      return "Elige un curso.";
    }
    return true;
  },

  modalidad: function () {
    if (form.modalidad.value === "") {
      return "Elige una modalidad.";
    }
    return true;
  },

  sede: function (valor) {
    // Si la sede está oculta (modalidad virtual) no se valida
    if (campoSede.hidden) {
      return true;
    }
    if (valor === "") {
      return "Elige una sede.";
    }
    return true;
  },

  clave: function (valor) {
    var falta = "";
    if (valor.length < 8) {
      falta = falta + " 8 caracteres,";
    }
    if (!/[A-Z]/.test(valor)) {
      falta = falta + " una mayúscula,";
    }
    if (!/[a-z]/.test(valor)) {
      falta = falta + " una minúscula,";
    }
    if (!/[0-9]/.test(valor)) {
      falta = falta + " un número,";
    }
    if (!/[^A-Za-z0-9]/.test(valor)) {
      falta = falta + " un símbolo,";
    }
    if (falta === "") {
      return true;
    }
    // quitamos la última coma y ponemos punto
    return "Te falta:" + falta.slice(0, -1) + ".";
  },

  clave2: function (valor) {
    if (valor !== "" && valor === form.clave.value) {
      return true;
    }
    return "Las contraseñas no coinciden.";
  },

  comentarios: function (valor) {
    if (valor.length > 200) {
      return "Máximo 200 caracteres.";
    }
    return true;
  },

  terminos: function () {
    if (form.terminos.checked) {
      return true;
    }
    return "Debes aceptar los términos.";
  },
};

// ===== Validar un campo =====
function validarCampo(input) {
  var resultado = reglas[input.name](input.value);
  var error = document.getElementById(input.name + "-error");

  if (resultado === true) {
    input.setAttribute("aria-invalid", "false");
    error.textContent = "";
    return true;
  } else {
    input.setAttribute("aria-invalid", "true");
    error.textContent = resultado;
    return false;
  }
}

// ===== Mostrar u ocultar la sede =====
function mostrarOcultarSede() {
  if (form.modalidad.value === "presencial") {
    campoSede.hidden = false;
  } else {
    campoSede.hidden = true;
    form.sede.value = "";
    form.sede.removeAttribute("aria-invalid");
    document.getElementById("sede-error").textContent = "";
    tocados.sede = false;
  }
}

// ===== Indicador de fuerza de la contraseña =====
function actualizarFuerza() {
  var clave = form.clave.value;
  var puntos = 0;

  if (clave.length >= 8) puntos++;
  if (/[A-Z]/.test(clave)) puntos++;
  if (/[a-z]/.test(clave)) puntos++;
  if (/[0-9]/.test(clave)) puntos++;
  if (/[^A-Za-z0-9]/.test(clave)) puntos++;

  if (clave === "") {
    fuerza.textContent = "Fuerza: -";
  } else if (puntos === 5) {
    fuerza.textContent = "Fuerza: fuerte";
  } else if (puntos >= 3) {
    fuerza.textContent = "Fuerza: media";
  } else {
    fuerza.textContent = "Fuerza: débil";
  }
}

// ===== Contador de comentarios =====
function actualizarContador() {
  var cantidad = form.comentarios.value.length;
  contador.textContent = cantidad + " / 200";

  if (cantidad > 180) {
    contador.classList.add("alerta");
  } else {
    contador.classList.remove("alerta");
  }
}

// ===== Tarjeta de confirmación =====
function mostrarResumen() {
  // borramos la tarjeta anterior si había una
  confirmacion.textContent = "";

  var tarjeta = document.createElement("article");

  var titulo = document.createElement("h2");
  titulo.textContent = "Inscripción recibida";
  tarjeta.append(titulo);

  agregarDato(tarjeta, "Nombre", form.nombre.value);
  agregarDato(tarjeta, "Cédula", form.cedula.value);
  agregarDato(tarjeta, "Correo", form.correo.value);
  agregarDato(tarjeta, "Celular", form.celular.value);
  agregarDato(tarjeta, "Fecha de nacimiento", form.nacimiento.value);
  agregarDato(tarjeta, "Curso", form.curso.value);
  agregarDato(tarjeta, "Modalidad", form.modalidad.value);
  if (form.modalidad.value === "presencial") {
    agregarDato(tarjeta, "Sede", form.sede.value);
  }
  if (form.comentarios.value !== "") {
    agregarDato(tarjeta, "Comentarios", form.comentarios.value);
  }

  confirmacion.append(tarjeta);
}

function agregarDato(tarjeta, etiqueta, valor) {
  var p = document.createElement("p");
  p.textContent = etiqueta + ": " + valor;
  tarjeta.append(p);
}

// ===== Eventos =====

// 1) Al salir de un campo se valida por primera vez y queda "tocado".
// Se usa true porque blur no burbujea (fase de captura).
form.addEventListener(
  "blur",
  function (e) {
    var nombre = e.target.name;
    if (reglas[nombre]) {
      tocados[nombre] = true;
      validarCampo(e.target);
    }
  },
  true,
);

// Mientras escribe: si el campo ya fue tocado, se valida en vivo.
form.addEventListener("input", function (e) {
  var nombre = e.target.name;

  if (nombre === "clave") {
    actualizarFuerza();
    // si cambia la contraseña se revalida la confirmación denuevo
    if (tocados.clave2) {
      validarCampo(form.clave2);
    }
  }

  if (nombre === "comentarios") {
    actualizarContador();
  }

  if (tocados[nombre]) {
    validarCampo(e.target);
  }
});

// Cuando cambia la modalidad se muestra u oculta la sede
form.addEventListener("change", function (e) {
  if (e.target.name === "modalidad") {
    mostrarOcultarSede();
    tocados.modalidad = true;
    validarCampo(e.target);
  }
});

// al enviar se valida todo y se enfoca el primer error.
form.addEventListener("submit", function (e) {
  e.preventDefault(); // no recargar la página

  var primerError = null;

  for (var i = 0; i < form.elements.length; i++) {
    var campo = form.elements[i];
    if (reglas[campo.name]) {
      var valido = validarCampo(campo);
      if (!valido && primerError === null) {
        primerError = campo;
      }
    }
  }

  if (primerError !== null) {
    primerError.focus();
    return;
  }

  mostrarResumen();

  // para reiniciar el formulario
  form.reset();
  tocados = {};
  mostrarOcultarSede();
  actualizarFuerza();
  actualizarContador();
});
