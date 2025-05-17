import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./paginas/Login";
import Main from "./paginas/Main";
import FormularioTurnos from "./paginas/FormularioTurnos";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/main" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/main"
          element={
            isLoggedIn ? <Main onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/turnos"
          element={isLoggedIn ? <FormularioTurnos /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
