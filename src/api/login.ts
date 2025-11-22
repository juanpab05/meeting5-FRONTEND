import { handleApiError } from "./utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const location = process.env.NODE_ENV === "development" || window.location.hostname === "localhost";

/**
 * Sends a login request to the backend API.
 *
 * @async
 * @function fetchLoginUser
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<any>} - JSON response from the server with token and user data.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 */
export async function fetchLoginUser(email: string, password: string): Promise<any> {
  try {
    const response = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({response, location: "fetchLoginUser"});
    }

    //if (location) {
      //console.log("[fetchLoginUser] User logged in successfully:", data);
    //}

    return data.data;
  } catch (error) {
    if (location) {
      console.error("[fetchLoginUser] Unexpected error:", error);
    }

    throw error;
  }
}

/**
 * @async
 * @function fetchToken
 * @returns {Boolean}
 * @description Verify is the user token is valid
 */
export async function fetchToken(token: string | null): Promise<boolean> {
  if (!token) return false;

  try {
    const response = await fetch(`${API}/users/verify-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({response, data, location: "fetchToken"});
    }

    return data;
  } catch (error) {
    if (location) {
      console.error("[fetchUserProfile] Unexpected error:", error);
    }

    throw error;
  }
}