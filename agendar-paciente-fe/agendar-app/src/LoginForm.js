import React, { useState } from "react";
import axios from "axios";

import Main from "./Main";
import PanelMedico from "./PanelMedico";

function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserRol, setLoggedInUserRol] = useState(null);
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

      setLoggedInUser(loginResponse.data.id);
      setLoggedInUserRol(loginResponse.data.rol_id);
    } catch (err) {
      setError("Login fallido. Verifique las credenciales.");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setForm({ username: "", password: "" });
  };

  if (loggedInUser) {
    if (loggedInUserRol === "3")
      return <Main id_externo={loggedInUser} onLogout={handleLogout} />;
    if (loggedInUserRol === "1")
      return <PanelMedico id_externo={loggedInUser} />;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-3">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ maxWidth: "100px", marginBottom: "10px" }}
          />
          <h2 className="mb-3">Iniciar Sesión</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Ingrese su usuario"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="form-label">
              ¿Ud. es ... ?
            </label>
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="Paciente">Paciente</option>
              <option value="Médico">Médico</option>
              <option value="Administrativo">Administrativo</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
export default LoginForm;
