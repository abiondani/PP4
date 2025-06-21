const jwt = require("jsonwebtoken");
const users = require("../models/users");
const dotenv = require("dotenv");
dotenv.config();

exports.getToken = (req, res) => {
  const { client_id, client_secret } = req.body;

  if (
    client_id === process.env.CLIENT_ID &&
    client_secret === process.env.CLIENT_SECRET
  ) {
    const token = jwt.sign({ app: client_id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });

    return res.json({ token, expires_in: process.env.TOKEN_EXPIRES_IN });
  } else {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
};

exports.login = (req, res) => {
  const authHeader = req.headers.authorization;
  const { username, password } = req.body;

  if (!authHeader) return res.status(401).json({ error: "Falta token" });

  const token = authHeader.split(" ")[1];

  try {
    console.log("entrada:" + token);
    console.log("back:" + process.env.TOKEN_SECRET);
    jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const id = user.id;
    const rol_id = user.rol_id;

    return res.json({ message: "Login exitoso", id, rol_id });
  } else {
    return res.status(401).json({ error: "Usuario o contraseña inválidos" });
  }
};
