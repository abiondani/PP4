import React, { useState } from "react";
import axios from "axios";
import Main from "./Main";
import PanelMedico from "./PanelMedico";

function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const tokenResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/token`,
        {
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
        }
      );

      const token = tokenResponse.data.token;

      const loginResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoggedInUser(loginResponse.data.username);
    } catch (err) {
      setError("Login fallido. Verifique las credenciales.");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setForm({ username: "", password: "" });
  };

  if (loggedInUser)
    return <Main username={loggedInUser} onLogout={handleLogout} />;

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginForm;
