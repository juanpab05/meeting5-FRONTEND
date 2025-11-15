import { HandleApiErrorOptions } from "../schemas/utils";

/**
 * Retrieves the authentication token from localStorage.
 * 
 * @function getToken
 * @returns {string|null} The JWT token string if exists, null otherwise.
 * 
 * @description
 * This function safely retrieves the authentication token stored in the browser's
 * localStorage. The token is used for authenticating API requests to the backend.
 * 
 * @example
 * const token = getToken();
 * if (token) {
 *   // User is potentially authenticated
 *   console.log('Token found:', token);
 * } else {
 *   // No token found, user needs to login
 *   console.log('No authentication token found');
 * }
 */
export function getToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Gets authorization headers for API requests.
 * 
 * @function getAuthHeaders
 * @returns {{Authorization: string, 'Content-Type': string}} Headers object with Authorization
 */
export function getAuthHeaders(): { Authorization: string; 'Content-Type': string } {
  const token = getToken();
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

/**
 * @function getNameUser
 * @returns string
 * @description return a string id of the user
 */
export function getNameUser(): string {
    const info = localStorage.getItem("user");
    const user = info ? JSON.parse(info) : null;
    return user?.name;
}

/**
 * @function getIdUser
 * @returns string
 * @description return a string name of the user
 */
export function getIdUser(): string {
    const info = localStorage.getItem("user");
    const user = info ? JSON.parse(info) : null;
    return user?.id;
}

export async function handleApiError({ response, data, location }: HandleApiErrorOptions): Promise<never> {
  let errorMessage = data?.error || "Ocurrió un error inesperado.";

  // Messages
  switch (response.status) {
    case 400:
      errorMessage = "Solicitud inválida. Verifica los datos enviados.";
      break;
    case 401:
      errorMessage = "Usuario no autenticado. Por favor inicia sesión.";
      break;
    case 403:
      errorMessage = "No tienes permisos para realizar esta acción.";
      break;
    case 404:
      errorMessage = "Recurso no encontrado.";
      break;
    case 500:
      errorMessage = "Error interno del servidor. Inténtalo más tarde.";
      break;
  }

  // Detail Log
  if (import.meta.env.MODE === "development") {
    console.error(
      `%c[${location || "API"}] Request failed (${response.status})`,
      "color: red; font-weight: bold;"
    );
    console.error("Mensaje:", errorMessage);
    console.error("Detalles:", { response, data });
  } else {
    console.log(`[${location || "API"}] Error manejado (${response.status})`);
  }

  throw new Error(errorMessage);
}
