let puntos = [];

const ctx = document.getElementById("graficoVelocidad").getContext("2d");

const grafico = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "v(t) velocidad km/h",
      data: [],
      borderColor: "#16a34a",
      backgroundColor: "rgba(34,197,94,0.25)",
      borderWidth: 3,
      fill: true,
      tension: 0.35,
      pointRadius: 6,
      pointBackgroundColor: "#16a34a",
      pointBorderColor: "white",
      pointBorderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 13,
            weight: "bold"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return "Velocidad: " + context.raw + " km/h";
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Velocidad v(t) km/h"
        }
      },
      x: {
        title: {
          display: true,
          text: "Tiempo t horas"
        }
      }
    }
  }
});

function agregarPunto() {
  const tiempo = parseFloat(document.getElementById("tiempo").value);
  const velocidad = parseFloat(document.getElementById("velocidad").value);

  if (isNaN(tiempo) || isNaN(velocidad) || tiempo < 0 || velocidad < 0) {
    alert("Ingresa tiempo y velocidad válidos.");
    return;
  }

  puntos.push({ tiempo, velocidad });

  puntos.sort((a, b) => a.tiempo - b.tiempo);

  document.getElementById("tiempo").value = "";
  document.getElementById("velocidad").value = "";

  actualizar();
}

function calcularIntegralTrapecio() {
  let distancia = 0;

  for (let i = 0; i < puntos.length - 1; i++) {
    const t1 = puntos[i].tiempo;
    const t2 = puntos[i + 1].tiempo;

    const v1 = puntos[i].velocidad;
    const v2 = puntos[i + 1].velocidad;

    const base = t2 - t1;
    const alturaPromedio = (v1 + v2) / 2;

    distancia += alturaPromedio * base;
  }

  return distancia;
}

function actualizar() {
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = "";

  puntos.forEach((punto, index) => {
    tabla.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${punto.tiempo.toFixed(2)} h</td>
        <td>${punto.velocidad.toFixed(2)} km/h</td>
      </tr>
    `;
  });

  const distanciaTotal = calcularIntegralTrapecio();

  const tiempoTotal = puntos.length > 1
    ? puntos[puntos.length - 1].tiempo - puntos[0].tiempo
    : 0;

  const velocidadPromedio = tiempoTotal > 0
    ? distanciaTotal / tiempoTotal
    : 0;

  document.getElementById("distanciaTotal").textContent =
    distanciaTotal.toFixed(2) + " km";

  document.getElementById("tiempoTotal").textContent =
    tiempoTotal.toFixed(2) + " h";

  document.getElementById("velocidadPromedio").textContent =
    velocidadPromedio.toFixed(2) + " km/h";

  grafico.data.labels = puntos.map(p => p.tiempo + " h");
  grafico.data.datasets[0].data = puntos.map(p => p.velocidad);
  grafico.update();

  moverMuneco(distanciaTotal);
}

function moverMuneco(distanciaTotal) {
  const recorrido = document.querySelector(".recorrido");
  const muneco = document.getElementById("muneco");

  const porcentaje = Math.min((distanciaTotal / 100) * 100, 100);

  document.getElementById("progreso").style.width = porcentaje + "%";
  document.getElementById("porcentajeTexto").textContent =
    porcentaje.toFixed(2) + "%";

  const anchoRecorrido = recorrido.clientWidth;
  const anchoMuneco = muneco.offsetWidth;

  const margenIzquierdo = 20;
  const margenDerecho = 95;

  const maximoMovimiento = anchoRecorrido - anchoMuneco - margenDerecho;

  const nuevaPosicion =
    margenIzquierdo + ((maximoMovimiento - margenIzquierdo) * porcentaje / 100);

  muneco.style.left = nuevaPosicion + "px";
}

function limpiarTodo() {
  puntos = [];

  document.getElementById("tabla").innerHTML = "";
  document.getElementById("distanciaTotal").textContent = "0 km";
  document.getElementById("tiempoTotal").textContent = "0 h";
  document.getElementById("velocidadPromedio").textContent = "0 km/h";
  document.getElementById("progreso").style.width = "0%";
  document.getElementById("porcentajeTexto").textContent = "0%";
  document.getElementById("muneco").style.left = "20px";

  grafico.data.labels = [];
  grafico.data.datasets[0].data = [];
  grafico.update();
}