import bcrypt from "bcryptjs";
import { ChangePassword } from "../schemas/user";
import { fetchUserProfile } from "./user";
import { getToken, handleApiError } from "./utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const location = process.env.NODE_ENV === "development" || window.location.hostname === "localhost";

/**
 * Uploads a new avatar for the authenticated user.
 *
 * @async
 * @function fetchUploadAvatar
 * @param {File} file - Avatar image file
 * @returns {Promise<any>} - JSON response from the server with updated user data.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 */
export async function fetchUploadAvatar(file: File): Promise<any> {
  try {
    const token = getToken()
    
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    // Obtener el ID del usuario
    const userProfile = await fetchUserProfile();
    const userID = userProfile.data._id;

    const formData = new FormData();
    formData.append('pfp', file);

    // Cambiar la ruta a /users/update-pfp/:id según el backend
    const response = await fetch(`${API}/users/update-pfp/${userID}`, {
      method: "PUT", // Cambiar a PUT según el backend
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({response, data, location: "fetchUploadAvatar"});
    }

    if (location) {
      console.log("[fetchUploadAvatar] Avatar uploaded successfully:", data);
    }

    return data;
  } catch (error) {
    if (location) {
      console.error("[fetchUploadAvatar] Unexpected error:", error);
    }

    throw error;
  }
}

/**
 * Verifies the user's current password by comparing with stored hash.
 *
 * @async
 * @function fetchVerifyPassword
 * @param {string} currentPassword - The current password to verify
 * @returns {Promise<boolean>} - Returns true if password is correct, throws error if not
 * @throws {Error} - Throws an error if the password is incorrect or request fails
 */
export async function fetchVerifyPassword(currentPassword: string): Promise<boolean> {
  try {
    // Obtener información del usuario usando el endpoint existente users/me
    const userProfile = await fetchUserProfile();
    
    if (!userProfile.data || !userProfile.data.password) {
      throw new Error('No se pudo obtener la información del usuario');
    }

    // Comparar la contraseña ingresada con el hash almacenado
    const isPasswordCorrect = await bcrypt.compare(currentPassword, userProfile.data.password);
    
    if (!isPasswordCorrect) {
      throw new Error('Contraseña incorrecta');
    }

    if (location) {
      console.log("[fetchVerifyPassword] Password verified successfully");
    }

    return true;
  } catch (error) {
    if (location) {
      console.error("[fetchVerifyPassword] Password verification failed:", error);
    }

    throw error;
  }
}

/**
 * Sends a change password request to the backend API.
 *
 * @async
 * @function fetchChangePassword
 * @param {ChangePassword} passwordData - Object containing current password and new password
 * @returns {Promise<any>} - JSON response from the server.
 * @throws {Error} - Throws an error if the request fails or returns a non-OK status.
 */
export async function fetchChangePassword(passwordData: ChangePassword): Promise<any> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("No authentication token found. Please login first.");
    }
    
    const response = await fetch(`${API}/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
      await handleApiError({response, data, location: "fetchChangePassword"});
    }

    if (location) {
      console.log("[fetchChangePassword] Password changed successfully:", data);
    }

    return data;
  } catch (error) {
    if (location) {
      console.error("[fetchChangePassword] Unexpected error:", error);
    }

    throw error;
  }
}
