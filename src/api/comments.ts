import { getAuthHeaders, handleApiError } from "./utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


/**
 * @function fetchGetComments
 * @description Fetch comments for a specific movie by its ID.
 * @param id - The ID of the movie to fetch comments for.
 * @returns 
 */
export async function fetchGetComments(id: string) {
    const response = await fetch(`${API}/comments/get-for-movies/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    const data = await response.json();
    
    if (response.ok === false) handleApiError({response, data, location: "fetchGetComments"});

    return data;
}

export async function fetchCreateComment({movie_id, comment}: {movie_id: string, comment: string}) {
    const response = await fetch(`${API}/comments/${movie_id}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({comment})
    });

    if (!response.ok) handleApiError({response, location: "fetchCreateComment"});

    return response;
}

export async function fetchEditComment({id, comment}: {id: string, comment: string}) {
    console.log(comment);
    const response = await fetch(`${API}/comments/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({comment})
    });
    handleApiError({response, location: "fetchEditComment"});
    return;
}

export async function fetchDeleteComment({id}: {id: string}) {
    const response = await fetch(`${API}/comments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    if (!response.ok) handleApiError({response, location: "fetchDeleteComment"});
    return;
}
