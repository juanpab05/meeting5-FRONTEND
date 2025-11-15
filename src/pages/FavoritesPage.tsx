import { useEffect, useState } from "react";
import { Movie } from "../schemas/movie";
import { Heart, Search } from "lucide-react";
import { fetchGetAllFavorites } from "../api/favorite";
import Loading from "../components/Loading";
import ShowError from "../components/ShowError";
import MovieModal from "../components/MovieModal";
import ViewCategories from "../components/ViewCategories";

export const FavoritesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
        try {
            setLoading(true);
            const response = await fetchGetAllFavorites();
            const data = await response.json(); 

            const moviesData = data;
            setMovies(moviesData);

            const allGenres: string[] = moviesData.flatMap((movie: Movie) => {
                return movie.genres
            });

            const uniqueGenres: string[] = [...new Set(allGenres)];

            setGenres(uniqueGenres);
        } catch (err) {
        console.error("Error al obtener películas:", err);
        setError("No se pudieron cargar las películas. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const term = searchTerm.toLowerCase();
    return (
      movie.title.toLowerCase().includes(term) ||
      movie.directors.some((d) => d.toLowerCase().includes(term)) ||
      movie.actors.some((a) => a.toLowerCase().includes(term))
    );
  });

  return (
    <main
      className="mt-20 flex flex-col w-full text-white px-8 self-start sm:mt-15"
      role="main"
      aria-labelledby="favorites-title"
    >
      {/* Header */}
      <header className="flex flex-col mb-8" role="banner">
        <h1
          id="favorites-title"
          className="flex text-5xl font-bold mb-4 gap-4 items-center"
        >
          <Heart
            className="text-red-500 fill-current w-10 h-10"
            aria-hidden="true"
          />
          <span>Favoritos</span>
        </h1>
        <p className="text-gray-500">
          Gestiona tu lista personal de películas guardadas
        </p>
      </header>

      {/* Spinner */}
      {loading && <Loading aria-live="polite" />}

      {/* Error */}
      {error && <ShowError messageError={error} aria-live="assertive" />}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Search Section */}
          <section
            className="mb-6"
            aria-labelledby="favorites-search-title"
            role="search"
          >
            <h2 id="favorites-search-title" className="sr-only">
              Buscar en tus películas favoritas
            </h2>

            <div className="relative mb-4 w-full">
              <label htmlFor="favorites-search" className="sr-only">
                Buscar en mis favoritos
              </label>
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
                aria-hidden="true"
              />
              <input
                id="favorites-search"
                type="text"
                placeholder="Buscar en mis favoritos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Campo de búsqueda de películas favoritas"
                className="w-full rounded border border-gray-600 bg-transparent p-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <div className="flex flex-row justify-between items-center">
              <p className="text-gray-400" aria-live="polite">
                {filteredMovies.length} películas favoritas encontradas
              </p>
            </div>
          </section>

          {/* Movie Categories Section */}
          <section
            aria-label="Películas favoritas organizadas por categoría"
            role="region"
          >
            {genres.map((genre) => {
              const moviesByGenre = filteredMovies.filter((movie) =>
                movie.genres.includes(genre)
              );
              if (moviesByGenre.length === 0) return null;

              return (
                <ViewCategories
                  key={genre}
                  genre={genre}
                  moviesByGenre={moviesByGenre}
                  setSelectedMovie={setSelectedMovie}
                />
              );
            })}

            {/* Modal con accesibilidad */}
            {selectedMovie && (
              <MovieModal
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="favorite-movie-modal-title"
              />
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default FavoritesPage;
