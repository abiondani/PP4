const historias = require("../models/historias");

exports.getHistoria = (req, res) => {
  const { id_externo } = req.body;
  const historia = historias.find((u) => u.id === id_externo);

  if (historia) {
    return res.json({ historia: historia.historia });
  } else {
    return res.status(401).json({ error: "Historia clínica no existe" });
  }
};
