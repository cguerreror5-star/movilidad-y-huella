// Parámetros (estimaciones): factor de emisión FE (g CO2/km) y velocidad V (km/h)
const MODOS = {
  auto:     { nombre: "Automóvil a gasolina", fe: 280, v: 23.5 },
  moto:     { nombre: "Motocicleta", fe: 100, v: 23.5 },
  publico:  { nombre: "Transporte público", fe: 45, v: 18.0 },
  bici:     { nombre: "Bicicleta", fe: 0, v: 15.0 },
  caminata: { nombre: "Caminata", fe: 0, v: 4.5 }
};
const UMBRAL_HORAS = 3.3;

// Calcula tiempo (h), emisión (kg CO2) y emisión evitada frente al automóvil
function calcular(modo, d, n) {
  const m = MODOS[modo];
  const tiempo = (d * n) / m.v;
  const emision = (d * n * m.fe) / 1000;
  const emisionAuto = (d * n * MODOS.auto.fe) / 1000;
  return { tiempo: tiempo, emision: emision, ahorro: emisionAuto - emision };
}

// Devuelve un mensaje de error o "" si los datos son válidos
function validar(d, n) {
  if (isNaN(d) || isNaN(n) || d <= 0 || n <= 0) return "Ingrese valores mayores a cero.";
  if (d > 200) return "La distancia máxima permitida es 200 km.";
  if (n > 40 || !Number.isInteger(n)) return "Los viajes deben ser un número entero entre 1 y 40.";
  return "";
}

const f = (x) => x.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function mostrar() {
  const modo = document.getElementById("modo").value;
  const d = parseFloat(document.getElementById("distancia").value);
  const n = parseFloat(document.getElementById("viajes").value);
  const msg = document.getElementById("mensaje");
  const res = document.getElementById("resultados");
  const error = validar(d, n);
  if (error !== "") {
    msg.textContent = error;
    msg.className = "error";
    res.innerHTML = "";
    return;
  }
  let filas = "";
  for (const clave in MODOS) {
    const r = calcular(clave, d, n);
    filas += "<tr" + (clave === modo ? ' class="sel"' : "") + "><td>" + MODOS[clave].nombre + "</td><td>" +
      f(r.tiempo) + "</td><td>" + f(r.emision) + "</td><td>" + f(r.ahorro) + "</td></tr>";
  }
  res.innerHTML = '<div class="tabla"><table><thead><tr><th>Modo</th><th>Tiempo semanal (h)</th>' +
    "<th>Emisión (kg CO₂)</th><th>CO₂ evitado vs. automóvil (kg)</th></tr></thead><tbody>" + filas + "</tbody></table></div>";
  const sel = calcular(modo, d, n);
  const horas = Math.round(sel.tiempo * 100) / 100;
  if (horas > UMBRAL_HORAS) {
    msg.textContent = "Alerta de habitabilidad: su tiempo semanal (" + f(horas) + " h) supera 3,3 h. Considere otro modo de transporte o ajustar su ruta.";
    msg.className = "alerta";
  } else {
    msg.textContent = "Su tiempo semanal de viaje (" + f(horas) + " h) no supera 3,3 h.";
    msg.className = "ok";
  }
}

if (typeof document !== "undefined") {
  document.getElementById("calcular").addEventListener("click", mostrar);
}
if (typeof module !== "undefined") { module.exports = { calcular, validar }; }
