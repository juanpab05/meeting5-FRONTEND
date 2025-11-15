import { Favorite, FavoriteResponse } from "../schemas/favorite";
import { getAuthHeaders, handleApiError } from "./utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * @function fetchApiCreatedFavorite
 * @param params 
 * @description Set a movie as favorite for an user
 */
export async function fetchApiCreateFavorite(params: Favorite): Promise<Response> {
  const response = await fetch(`${API}/favorites/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    await handleApiError({response, location: "fetchApiCreateFavorite"});
  }  

  return response;
}

/**
 * @function fetchApiGetFavorite
 * @param params 
 * @description fetch boolean, true is the movie is 
 * favorite by user, otherwise false 
 * @returns 
 */
export async function fetchIsFavorite(params:Favorite): Promise<FavoriteResponse> {
  const response = await fetch(`${API}/favorites/get/${params.movie_id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    await handleApiError({response, location: "fetchIsFavorite"});
  }  

  if (response.ok) { return {isFavorite: true}  } else {return {isFavorite: false}}
}

export async function fetchApiDeleteFavorite(params:Favorite) {
  const response = await fetch(`${API}/favorites/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify(params)
  })
  
  if (!response.ok) {
    await handleApiError({response, location: "fetchApiDeleteFavorite"});
  }  

  return response;
}

/**
 * @function fetchGetAllFavorites
 * @returns
 */
export async function fetchGetAllFavorites() {
    const response = await fetch(`${API}/favorites/user-favorites`, {
    method: "GET",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    await handleApiError({response, location: "fetchGetAllFavorites"});
  }  
  
  return response;
}