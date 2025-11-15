import { useEffect, useState } from "react";
import { Movie } from "../schemas/movie";
import MovieRating from "./MovieRating";
import { fetchMovieStatistics } from "../api/ratings";
import { Star } from "lucide-react";

interface InfoStart {
  count: number;
  percentage: number,
}

interface Starts {
  oneStars: InfoStart;
  twoStars: InfoStart;
  threeStars: InfoStart;
  fourStars: InfoStart;
  fiveStars: InfoStart;
}

interface MovieStatisticsData {
  totalRatings: number;
  averageRating: number;
  starDistribution: Starts;
}

export const MovieStatistics = ({ idMovie, movie, onStatisticsChange}: { idMovie: string, movie: Movie, onStatisticsChange: () => void}) => {
  const [statistics, setStatistics] = useState<MovieStatisticsData | null>(null);

  const loadStatistics = async () => {
    try {
      const data = await fetchMovieStatistics(idMovie);
      setStatistics(data);
      onStatisticsChange?.();
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [idMovie]);

  const handleRatingChange = async () => {
    await loadStatistics();
    onStatisticsChange?.();
  };

  const getMostRated = () => {
    if (!statistics || !statistics.starDistribution) return null;

    const entries = Object.entries(statistics.starDistribution);
    if (entries.length === 0) return null;

    const [star, data] = entries.reduce((max, curr) =>
      curr[1].count > max[1].count ? curr : max
    );

    return { star, percentage: data.percentage };
  };

  const mostRated = getMostRated();

  return (
    <div
      className="bg-gray-900 rounded-xl p-4 w-full md:w-85 shadow-md flex flex-col gap-5"
      role="region"
      aria-labelledby="movie-statistics-title"
    >
      {/* Movie Rating */}
      <MovieRating 
        idMovie={idMovie} 
        movie={movie} 
        onStatisticsUpdate={handleRatingChange}
        />

      {/* Summary */}
      <div>
        <h3 id="movie-statistics-title" className="text-sm font-semibold mb-2">
          Resumen
        </h3>
        <p className="text-xs text-gray-300">
          <strong>Opción más valorada:</strong>{" "}
            {mostRated ? (
              <>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium text-gray-100">
                    {mostRated.star.replace("Stars", "")}
                  </span>
                  <span className="text-gray-400">({mostRated.percentage.toFixed(1)}%)</span>
                </span>
              </>
            ) : (
              <span className="text-gray-500">Cargando...</span>
            )}
        </p>
        <p className="text-xs text-gray-300">
          <strong>Tendencia:</strong>{" "}
          {statistics
            ? statistics.averageRating >= 3.5
              ? "Positiva"
              : statistics.averageRating >= 2
              ? "Neutral"
              : "Negativa"
            : "Cargando..."}
        </p>
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Estadísticas</h3>
        <p className="text-xs text-gray-300">
          <strong>Calificaciones:</strong>{" "}
            {statistics ? statistics.totalRatings.toLocaleString() : "Cargando..."}
            {/* 15,420 */}
        </p>
      </div>
    </div>
  );
};

export default MovieStatistics;
