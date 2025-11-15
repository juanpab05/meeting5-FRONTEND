import { handleApiError } from "./utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const location = process.env.NODE_ENV === "development" || window.location.hostname === "localhost";

/**
 * Sends a password recovery request to the backend API.
 *
 * @async
 * @function fetchRecoverPassword
 * @param {string} email - User email
 * @returns {Promise<Response>} - Raw response from the server.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function fetchRecoverPassword(email: string): Promise<Response> {
  try {
    const response = await fetch(`${API}/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      await handleApiError({response, location: "fetchRecoverPassword"});
    }

    if (location) {
      console.log("[fetchRecoverPassword] Status:", response.status);
    }

    return response;
  } catch (error) {
    if (location) {
      console.error("[fetchRecoverPassword] Unexpected error:", error);
    }

    throw error;
  }
}

/**
 * Sends a password reset request to the backend API.
 *
 * @async
 * @function fetchResetPassword
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise<any>} - JSON response from the server.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 */
export async function fetchResetPassword(token: string, newPassword: string, confirmPassword: string): Promise<any> {
  try {
    // Enviar el token como query parameter en lugar del body
    const response = await fetch(`${API}/users/reset-password?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        password: newPassword, // Cambiar newPassword a password para coincidir con el backend
        confirmPassword 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({response, data, location: "fetchResetPassword"});
    }

    if (location) {
      console.log("[fetchResetPassword] Password reset successful:", data);
    }

    return data;
  } catch (error) {
    if (location) {
      console.error("[fetchResetPassword] Unexpected error:", error);
    }

    throw error;
  }
}
