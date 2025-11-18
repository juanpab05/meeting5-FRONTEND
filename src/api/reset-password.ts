import { handleApiError } from "./utils";

// URL base de la API. Se toma de la variable de entorno VITE_API_URL.
// Si no existe, se usa un fallback local.
const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Flag para mostrar logs en desarrollo/local
const isDev =
  process.env.NODE_ENV === "development" || window.location.hostname === "localhost";

/**
 * Envía una solicitud de recuperación de contraseña al backend.
 *
 * Endpoint esperado: POST /users/password-reset/request
 *
 * @async
 * @function fetchRecoverPassword
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise<any>} - Respuesta JSON del servidor
 * @throws {Error} - Lanza un error si la petición falla o el servidor responde con error
 */
export async function fetchRecoverPassword(email: string): Promise<any> {
  try {
    const response = await fetch(`${API}/users/password-reset/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({ response, data, location: "fetchRecoverPassword" });
    }

    if (isDev) {
      console.log("[fetchRecoverPassword] Status:", response.status, "Response:", data);
    }

    return data;
  } catch (error) {
    if (isDev) {
      console.error("[fetchRecoverPassword] Unexpected error:", error);
    }
    throw error;
  }
}

/**
 * Envía una solicitud de confirmación de reseteo de contraseña al backend.
 *
 * Endpoint esperado: POST /users/password-reset/confirm
 *
 * Body esperado:
 * {
 *   "token": "abc-123-def-456",
 *   "newPassword": "nuevaPassword123"
 * }
 *
 * @async
 * @function fetchResetPassword
 * @param {string} token - Token de reseteo recibido por email
 * @param {string} newPassword - Nueva contraseña del usuario
 * @returns {Promise<any>} - Respuesta JSON del servidor
 * @throws {Error} - Lanza un error si la petición falla o el servidor responde con error
 */
export async function fetchResetPassword(token: string, newPassword: string): Promise<any> {
  try {
    const response = await fetch(`${API}/users/password-reset/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({ response, data, location: "fetchResetPassword" });
    }

    if (isDev) {
      console.log("[fetchResetPassword] Password reset response:", data);
    }

    return data;
  } catch (error) {
    if (isDev) {
      console.error("[fetchResetPassword] Unexpected error:", error);
    }
    throw error;
  }
}
