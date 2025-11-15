import { useNavigate } from "react-router";
import { CardMovieProps } from "../schemas/movie";
import { Play, Info } from "lucide-react";
import React, { forwardRef, Ref } from 'react';

// Tipos para la referencia
type MovieCardRef = HTMLDivElement | null; 

interface ExtendedCardMovieProps extends CardMovieProps {
    // Prop que el padre usará para mover el foco (Roving TabIndex).
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>, movieId: string) => void;
}

interface ExtendedCardMovieProps extends CardMovieProps {
  // Prop que el padre usará para mover el foco (Roving TabIndex).
  class_name: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>, movieId: string) => void;
}

// Usamos forwardRef para permitir que el padre asigne una ref al div
export const CardMovie = forwardRef<MovieCardRef, ExtendedCardMovieProps>(({ movie, class_name, onInfoClick, onKeyDown }, ref: Ref<MovieCardRef>) => {
  const navigate = useNavigate();
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo(0, 0);
    navigate(`/view-movie/${movie._id}`);
  };

  const handleView = () => {
    window.scrollTo(0, 0);
    navigate(`/view-movie/${movie._id}`);
  };

  // Manejador simple de teclado - solo navegación entre tarjetas y activación
  const handleLocalKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // 1. Activación simple (Enter y Space) - siempre va a ver la película
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleView();
      return;
    }

    // 2. Navegación entre tarjetas (Flechas)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) && onKeyDown) {
      onKeyDown(event, movie._id);
    }
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de la película ${movie.title}`}
      aria-describedby={`movie-${movie._id}-desc`}
      onClick={handleView}
      onKeyDown={handleLocalKeyDown}
      className={class_name}
    >
      <img
        src={movie.poster?.posterURL || "/placeholder.jpg"}
        alt={`Póster de ${movie.title}`}
        className="w-full h-full object-cover group-hover:brightness-75 group-focus-within:brightness-75 transition duration-300"
      />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent transition duration-300"
      >
        <div className="p-3" id={`movie-${movie._id}-desc`}>
          <p className="font-bold text-white text-sm mb-2">{movie.title}</p>
          <div className="flex gap-2">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label={`Reproducir ${movie.title}`}
            >
              <Play size={14} aria-hidden="true" />
              Ver
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick(movie);
              }}
              className="flex items-center gap-2 bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label={`Ver información de ${movie.title}`}
            >
              <Info size={14} aria-hidden="true" />
              Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CardMovie;