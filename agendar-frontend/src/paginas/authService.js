// src/services/authService.js
export async function login(usuario, contrasena) {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, contrasena }),
  });

  if (!response.ok) {
    throw new Error("Error en login");
  }

  return await response.json();
}
