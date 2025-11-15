import { getAuthHeaders, handleApiError } from "./utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * @function fetchUserRate
 * @description fetch user rate
 * @param id id movie
 * @return
 */
export async function fetchUserRate(id: string): Promise<any> {
    const response = await fetch(`${API}/ratings/user-rate/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    })

    if (!response.ok) handleApiError({response, location: "fetchUserRate"});

    return response;
}

/**
 * @function fetchUserStatistics
 * @description fetch user ratings statistics
 */
export async function fetchUserStatistics() {
    const response = await fetch(`${API}/ratings/user-stadistics`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    const data = response.json();

    if (response.ok === false) handleApiError({response, data, location: "fetchUserRatings"});

    return data;
}

/**
 * @function fetchDeleteRating
 * @description fetch delete rating by user
 * @param id id movie
 * @returns 
 */
export async function fetchDeleteRating({id}: {id: string}) {
    const response = await fetch(`${API}/ratings/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    if (!response.ok) handleApiError({response, location: "fetchDeleteRatings"});
    return response;
}

/**
 * @function fetchEditRating
 * @param param0 
 * @returns 
 */
export async function fetchEditRating({id, raiting}: {id: string, raiting: number}) {
    const response = await fetch(`${API}/ratings/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({raiting})
    });

    handleApiError({response, location: "fetchEditRatings"});
    
    return response;
}


/**
 * @function fetchCreateRating
 * @description Create a new rating for a movie.
 * @param id - The ID of the movie to rate.
 * @param raiting - The rating value.
 * @returns 
 */
export async function fetchCreateRating({id, rate}: {id: string, rate: number}) {
    const response = await fetch(`${API}/ratings/${id}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({rate})
    });

    if (!response.ok) handleApiError({response, location: "fetchCreateRatings"});
    
    return response;
}

/**
 * @function fetchMovieStatistics
 * @description fetch movie'statistics
 * @param idMovie 
 * @returns 
 */
export async function fetchMovieStatistics(idMovie: string) {
    const response = await fetch(`${API}/ratings/stadistics/${idMovie}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json()

    if (!response.ok) handleApiError({response, data, location: "fetchMovieStatistics"})

    return data;
}