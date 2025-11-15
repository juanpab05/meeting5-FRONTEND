import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ShowError from "../components/ShowError";
import { Movie } from "../schemas/movie";
import CardMovie from "../components/CardMovie";
import MovieModal from "../components/MovieModal";
import { fetchApiJson } from "../api/movie";
import { useNavigate } from "react-router";

export const HomePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchMovies = async () => {
          try {
            setLoading(true);
            const response = await fetchApiJson();
            const data = await response.json();
    
            if (data.success && Array.isArray(data.data)) {
              const moviesData = data.data.slice(0,4);
              setMovies(moviesData);

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

    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos.");
        setLoading(false);
      }
    };

    fetchMovies();
    fetchData();
  }, []);

  if (loading) return <Loading aria-live="polite" />;
  if (error) return <ShowError messageError={error} aria-live="assertive" />;

  if (error) {
    return <ShowError messageError={error} />;
  }


  
  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col justify-center items-center"
      role="main"
      aria-labelledby="home-title"
    >
      {/* HERO */}
      <header
        className="relative h-[75vh] md:h-[85vh] flex items-center"
        role="banner"
        aria-label="Película destacada"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1200&q=80&auto=format&fit=crop?w=1600&q=80&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
          aria-hidden="true"
        />

        <div className="container mx-auto relative z-10 px-6">
          <div className="flex items-center md:items-end h-full">
            <div className="flex items-start gap-6 md:gap-8">
              {/* Imagen del póster */}
              <img
                src="https://res.cloudinary.com/dsyxsanls/image/upload/v1760245920/CINEMA_SPACE/POSTERS/poster_68e5dca238f364bb8f7f35f4_1760245919247.jpg"
                alt={"Batman: el caballero de la noche"}
                className="hidden sm:block h-54 w-36 md:w-56 lg:w-72 rounded-md shadow-2xl object-cover"
              />

              {/* Textos principales */}
              <div className="max-w-xl">
                <h1
                  id="home-title"
                  className="text-3xl md:text-6xl font-extrabold leading-tight mb-4"
                >
                  <span className="text-red-500">Cinema</span> Space
                </h1>

                <p className="text-gray-200 text-sm md:text-base mb-6 max-w-xl">
                  Acción, drama, comedia y mucho más — tu próxima historia te
                  espera.
                </p>

                {/* Botones accesibles */}
                <nav
                  aria-label="Acciones principales"
                  className="flex gap-3 flex-wrap items-center sm:flex-wrap md:flex-nowrap"
                >
                  <button
                    aria-label="Reproducir película destacada"
                    title="Reproducir"
                    className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-md font-semibold shadow hover:brightness-95"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Reproducir
                  </button>

                  <button
                    onClick={() => navigate("/catalog")}
                    aria-label="Ir al catálogo de películas"
                    title="Buscar películas"
                    className="flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-red-700 transition"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Buscar Películas
                  </button>

                  <button
                    aria-label="Ver más información sobre Cinema Space"
                    title="Más información"
                    className="flex items-center gap-3 bg-gray-700 bg-opacity-60 text-white px-5 py-3 rounded-md font-medium hover:bg-opacity-80"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                      <path
                        d="M12 8v4l2 2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Más información
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECCIÓN DE PELÍCULAS POPULARES */}
      <main
        className="container mx-auto px-6 py-12"
        aria-labelledby="popular-title"
        role="region"
      >
        <h2 id="popular-title" className="text-xl font-semibold mb-6">
          Populares en Cinema Space
        </h2>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          role="list"
          aria-label="Lista de películas populares"
        >
          {movies.map((movie) => (
            <div key={movie._id} className="div-home-peliculas" >
              <CardMovie
                movie={movie}
                class_name="group relative w-54 h-78 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-110 hover:z-10 shadow-md hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-500"
                onInfoClick={(m) => setSelectedMovie(m)}
                />
              </div>
          ))}

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
        </div>
      </main>
    </div>
  );
};

export default HomePage;
