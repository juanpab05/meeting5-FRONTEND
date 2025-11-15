import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchApiJson } from "../api/movie";
import CardMovie from "../components/CardMovie";
import { Movie } from "../schemas/movie";
import { ViewMode } from "../schemas/movie";
import ViewCategories from "../components/ViewCategories";
import MovieModal from "../components/MovieModal";
import Loading from "../components/Loading";
import ShowError from "../components/ShowError";
import { Search } from "lucide-react";

export const Catalog: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("categorias");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const navigate = useNavigate();

  // fetch all movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetchApiJson();
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const moviesData = data.data;
          setMovies(moviesData);

          const allGenres: string[] = moviesData.flatMap((movie: Movie) => movie.genres);
          const uniqueGenres: string[] = [...new Set(allGenres)];
          setGenres(uniqueGenres);
        } else {
          throw new Error("Respuesta del servidor no válida");
        }
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
      className="mt-20 w-full max-w-screen px-8 flex flex-col text-white self-start sm:mt-15"
      role="main"
      aria-labelledby="catalog-title"
    >
      {/* Header */}
      <header className="flex flex-col mb-8" role="banner">
        <div className="flex justify-between items-center mb-4">
          <h1 id="catalog-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mr-4">
            Catálogo de películas
          </h1>

          {/* Botón Inicio */}
          <button
            type="button"
            onClick={() => navigate("/home")}
            aria-label="Volver a la página de inicio"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 sm:px-6 md:px-8 rounded transition-colors flex-shrink-0 ml-auto focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Inicio
          </button>
        </div>
        <p className="text-gray-500 text-sm sm:text-base pr-0 sm:pr-4 md:pr-8">
          Explora nuestro catálogo organizado por géneros. Haz clic en cualquier
          portada para ver detalles completos y reproducir.
        </p>
      </header>

      {/* Spinner */}
      {loading && <Loading aria-live="polite" />}

      {/* Error */}
      {error && <ShowError messageError={error} aria-live="assertive" />}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Input de búsqueda y controles */}
          <section
            className="mb-6"
            aria-labelledby="search-section-title"
            role="search"
          >
            <h2 id="search-section-title" className="sr-only">
              Buscar y filtrar películas
            </h2>

            <div className="relative mb-4 w-full">
              <label htmlFor="movie-search" className="sr-only">
                Buscar película
              </label>
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
                aria-hidden="true"
              />
              <input
                id="movie-search"
                type="text"
                placeholder="Buscar películas por título, director o actor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Campo de búsqueda de películas"
                className="w-full rounded border border-gray-600 bg-transparent p-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            {/* Información y botones de vista */}
            <div className="flex flex-row justify-between items-center">
              <p className="text-gray-400" aria-live="polite">
                {genres.length} géneros con {filteredMovies.length} películas
              </p>

              <div
                className="flex gap-2"
                role="group"
                aria-label="Opciones de visualización del catálogo"
              >
                <button
                  className={`p-2 rounded border ${
                    viewMode === "categorias" ? "bg-red-600" : "bg-gray-700"
                  }`}
                  onClick={() => setViewMode("categorias")}
                  aria-pressed={viewMode === "categorias"}
                  aria-label="Ver catálogo por categorías"
                >
                  Por categorías
                </button>

                <button
                  className={`p-2 rounded border ${
                    viewMode === "sinOrden" ? "bg-red-600" : "bg-gray-700"
                  }`}
                  onClick={() => setViewMode("sinOrden")}
                  aria-pressed={viewMode === "sinOrden"}
                  aria-label="Ver todas las películas sin ordenar por género"
                >
                  Todas
                </button>
              </div>
            </div>
          </section>

          {/* Listado de películas */}
          {viewMode === "categorias" ? (
            <section
              aria-label="Películas organizadas por categorías"
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
            </section>
          ) : (
            <section
              className="flex flex-wrap gap-4"
              aria-label="Listado de todas las películas"
              role="region"
            >
              {filteredMovies.map((movie) => (
                <div key={movie._id} className="flex-shrink-0">
                  <CardMovie
                    movie={movie}
                    class_name="group relative w-44 h-64 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-110 hover:z-10 shadow-md hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-500"
                    onInfoClick={(m) => setSelectedMovie(m)}
                  />
                </div>
              ))}
            </section>
          )}

          {/* Modal de detalles */}
          {selectedMovie && (
            <MovieModal
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="movie-modal-title"
            />
          )}
        </>
      )}
    </main>
  );
};

export default Catalog;
