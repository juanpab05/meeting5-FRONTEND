import { useNavigate } from "react-router";
import { PropsMovieModal } from "../schemas/movie";
import { useEffect, useRef, useState } from "react";

export const MovieModal = ({ movie, onClose }: PropsMovieModal) => {
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedButton, setSelectedButton] = useState<'play' | 'close'>('play'); // Por defecto selecciona "Reproducir"

    // Auto-focus al modal cuando se abre
    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.focus();
        }
    }, []);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose(null);
        }
    };

    // Manejo de navegación con teclado
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
            case 'Tab':
                event.preventDefault();
                // Alternar entre 'play' y 'close'
                setSelectedButton(prev => prev === 'play' ? 'close' : 'play');
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                if (selectedButton === 'play') {
                    navigate(`/view-movie/${movie._id}`);
                } else {
                    onClose(null);
                }
                break;

            case 'Escape':
                event.preventDefault();
                onClose(null);
                break;
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 px-4 sm:px-8 md:px-16 lg:px-24"
            role="dialog"
            aria-labelledby="movie-modal-title"
            aria-describedby="movie-modal-description"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="bg-gray-900 rounded-xl max-w-3xl w-full p-6 text-white relative shadow-2xl focus:outline-none"
            >
                <button
                    onClick={() => onClose(null)}
                    className={`absolute top-3 right-4 text-2xl transition ${selectedButton === 'close'
                        ? 'text-white ring-2 ring-white rounded'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    aria-label="Cerrar modal"
                >
                    ✕
                </button>

                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src={movie.poster?.posterURL || "/placeholder.jpg"}
                        alt={`Póster de la película ${movie.title}`}
                        className="w-48 h-64 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h2 id="movie-modal-title" className="text-2xl font-bold mb-2">
                            {movie.title}
                        </h2>
                        <p id="movie-modal-description" className="text-sm text-gray-400 mb-3">
                            ⭐ {movie.rating || "4.6"} / 5.0 • {movie.releaseDate || "2024"}
                        </p>
                        <p className="text-gray-300 mb-4">
                            {movie.description ||
                                "Un científico debe navegar a través de diferentes dimensiones temporales para salvar a su familia."}
                        </p>
                        <p><span className="font-semibold">Director:</span> {movie.directors?.join(", ") || "Desconocido"}</p>
                        <p><span className="font-semibold">Actores:</span> {movie.actors?.join(", ") || "No especificado"}</p>

                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={() => navigate(`/view-movie/${movie._id}`)}
                                className={`px-5 py-2 rounded-lg transition ${selectedButton === 'play'
                                    ? 'bg-red-700 text-white ring-2 ring-white'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                aria-label="Reproducir película"
                            >
                                Reproducir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;