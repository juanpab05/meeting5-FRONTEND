import { Movie } from "../schemas/movie";
import { handleApiError } from "./utils";


const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * @function fetchApiMovie
 * @param id string  
 * @description fetch movie's info
 * @returns Movie
 */
export async function fetchApiMovie(id: string | undefined): Promise<Movie> {
  const response = await fetch(`${API}/movies/${id}`, {
    method: "GET", 
    headers:{
      "Content-Type": "application/json"
    }
  });

  const data = response.json();

  if (!response.ok) {
    await handleApiError({response, data, location: "fetchApiMovie"});
  }  

  return data;
}

/**
 * @function fetchApiJson
 * @returns Movie[]
 * @description fetch all movies in the app
 */
export async function fetchApiJson(): Promise<Response> {
  const response = await fetch(`${API}/movies/catalog`, {
    method: "GET", 
    headers:{
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    await handleApiError({response, location: "fetchApiJson"});
  }  

  return response;
}

/**
 * @function fetchBestRatedMovies
 * @returns Promise<Movie[]>
 * @description fetch best rated movies (rating >= 4.0)
 */
export async function fetchBestRatedMovies(): Promise<Movie[]> {
  const response = await fetch(`${API}/movies/catalog-rating`, {
    method: "GET", 
    headers:{
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    await handleApiError({response, location: "fetchBestRatedMovies"});
  }  

  const data = await response.json();
  return data.movies;
}

