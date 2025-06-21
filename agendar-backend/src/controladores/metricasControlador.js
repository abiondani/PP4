const {
  obtenerRespuestasPorMes,
  obtenerRespuestasPorAnio,
  obtenerPreguntas,
} = require("../modelos/metricasModelo");

const calcularEstadisticas = (valores) => {
  if (valores.length === 0) return { media: 0, moda: 0, mediana: 0 };

  const media = valores.reduce((acc, v) => acc + v, 0) / valores.length;

  const frecuencias = {};
  valores.forEach((v) => (frecuencias[v] = (frecuencias[v] || 0) + 1));
  const moda = parseInt(
    Object.keys(frecuencias).reduce((a, b) =>
      frecuencias[a] >= frecuencias[b] ? a : b
    )
  );

  const ordenado = [...valores].sort((a, b) => a - b);
  const mitad = Math.floor(ordenado.length / 2);
  const mediana =
    ordenado.length % 2 === 0
      ? (ordenado[mitad - 1] + ordenado[mitad]) / 2
      : ordenado[mitad];

  return { media, moda, mediana };
};

const procesarMetricas = (respuestas, preguntas) => {
  return preguntas.map((pregunta, i) => {
    const clave = `respuesta${i + 1}`;
    const valores = respuestas.map((r) => r[clave]).filter(Boolean);
    const { media, moda, mediana } = calcularEstadisticas(valores);
    return {
      pregunta: pregunta.pregunta,
      media: Number(media.toFixed(2)),
      moda,
      mediana,
    };
  });
};

const metricasPorMes = async (req, res) => {
  const { mes } = req.params;
  try {
    const respuestas = await obtenerRespuestasPorMes(mes);
    const preguntas = await obtenerPreguntas();
    const metricas = procesarMetricas(respuestas, preguntas);
    res.json(metricas);
  } catch (error) {
    console.error("Error al calcular métricas por mes:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const metricasPorAnio = async (req, res) => {
  const { anio } = req.params;
  try {
    const respuestas = await obtenerRespuestasPorAnio(anio);
    const preguntas = await obtenerPreguntas();
    const metricas = procesarMetricas(respuestas, preguntas);
    res.json(metricas);
  } catch (error) {
    console.error("Error al calcular métricas por año:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  metricasPorMes,
  metricasPorAnio,
};
