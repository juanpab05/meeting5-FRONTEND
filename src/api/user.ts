import { getToken, handleApiError } from "./utils";
import { UserData } from '../schemas/user';

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const location = process.env.NODE_ENV === "development" || window.location.hostname === "localhost";

/**
 * Sends a registration request to the backend API.
 *
 * @async
 * @function fetchRegisterUser
 * @param {User} params - User registration data (name, email, password, etc.)
 * @returns {Promise<any>} - JSON response from the server.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 *
 */
export async function fetchRegisterUser(params: UserData): Promise<any> {
  try {
    const response = await fetch(`${API}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({response, data, location: "fetchRegisterUser"});
    }

    if (
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost"
    ) {
      console.log("[fetchRegisterUser] User registered successfully:", data);
    }

    return data;
  } catch (error) {
    if (
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost"
    ) {
      console.error("[fetchRegisterUser] Unexpected error:", error);
    }

    throw error;
  }
}

/**
 * Retrieves the authenticated user's profile information.
 *
 * @async
 * @function fetchUserProfile
 * @returns {Promise<any>} - JSON response from the server with user data.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 *
 * @example
 * const userProfile = await fetchUserProfile();
 * console.log(userProfile.data); // User profile data
 */
export async function fetchUserProfile(): Promise<any> {
  try {
    const token = getToken();
    if (!token) {
      console.warn("No hay token, no se puede obtener el perfil");
      return null;
    }

    const response = await fetch(`${API}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        // 👈 usuario no encontrado, devolver null en vez de lanzar error
        return null;
      }
      await handleApiError({ response, data, location: "fetchUserProfile" });
    }

    return data;
  } catch (error) {
    console.error("[fetchUserProfile] Unexpected error:", error);
    throw error;
  }
}


/**
 * Updates the authenticated user's profile information.
 *
 * @async
 * @function fetchUpdateUserProfile
 * @param {Partial<User>} userData - User data to update
 * @returns {Promise<any>} - JSON response from the server with updated user data.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 */
export async function fetchUpdateUserProfile(userData: Partial<UserData>): Promise<any> {
  try {
    const token = getToken();
    if (!token) throw new Error('No hay token de autenticación disponible');

    const response = await fetch(`${API}/users/profile`, { // 👈 usa /profile
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({ response, data, location: "fetchUpdateUserProfile" });
    }

    return data;
  } catch (error) {
    if (location) {
      console.error("[fetchUpdateUserProfile] Unexpected error:", error);
    }
    throw error;
  }
}

/**
 * Changes the authenticated user's password.
 *
 * @async
 * @function fetchChangePassword
 * @param {string} currentPassword - The user's current password.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<any>} - JSON response from the server.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 */
export async function fetchChangePassword(currentPassword: string, newPassword: string) {
  try {
    const token = getToken();
    if (!token) throw new Error("No hay token de autenticación disponible");

    const response = await fetch(`${API}/users/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al cambiar la contraseña");
    }

    return data;
  } catch (error) {
    console.error("[fetchChangePassword] Unexpected error:", error);
    throw error;
  }
}

/**
 * Deletes the authenticated user's account.
 *
 * @async
 * @function fetchDeleteUser
 * @returns {Promise<any>} - JSON response from the server.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 */
export async function fetchDeleteUser(): Promise<any> {
  try {
    const token = getToken()
    
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const response = await fetch(`${API}/users/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({response, data, location: "fetchDeleteUser"});
    }

    if (location) {
      console.log("[fetchDeleteUser] User account deleted successfully:", data);
    }

    return data;
  } catch (error) {
    if (location) {
      console.error("[fetchDeleteUser] Unexpected error:", error);
    }

    throw error;
  }
}
