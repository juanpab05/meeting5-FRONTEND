import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { 
  fetchCreateRating, 
  fetchDeleteRating, 
  fetchMovieStatistics, 
  fetchUserRate 
} from "../api/ratings";
import { Movie } from "../schemas/movie";

interface MovieRatingProps {
  idMovie: string;
  movie: Movie;
  onStatisticsUpdate?: (stats: MovieStatistics) => void; 
}

interface UserRating {
  _id: string; //id rating
  user_id: string;
  movie_id: string;
  user_email: string;
  rate: number;
  movie_title: string;
  createdAt: string;
}

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

interface MovieStatistics {
  totalRatings: number;
  averageRating: number;
  starDistribution: Starts;
}

const MovieRating: React.FC<MovieRatingProps> = ({ idMovie, movie, onStatisticsUpdate }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [movieRating, setMovieRating] = useState<number>(movie.rating);
  const [showMessage, setShowMessage] = useState(false);
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [statistics, setStatistics] = useState<MovieStatistics | null>(null);

  {/** Get User rate */}
  const handleRate = async () => {
    try {
      const response = await fetchUserRate(idMovie);
      const data = await response.json();        

      if (!data || Object.keys(data).length === 0) {
        setUserRating(null);
        setShowMessage(false);
      } else {
        setUserRating(data);
        setShowMessage(true);
      }
    } catch (error) {
      console.error("Error obteniendo la calificación del usuario:", error);
      setUserRating(null);
    }
  };

  const handleStatistics = async () => {
      const response = await fetchMovieStatistics(idMovie);
      setStatistics(response)

      if (onStatisticsUpdate) {
       onStatisticsUpdate(response);
      }

      return response;
  } 

  // check if the movie has rate by an user
  useEffect(() => {
    handleRate()
    handleStatistics()
  }, [])

  const handleRemove = async () => {
    if (!userRating?._id) return;

    try {
      await fetchDeleteRating({id: userRating._id});
      await handleRate()
      const updatedStats = await handleStatistics();

      const totalRatings = updatedStats?.totalRatings ?? 0;
      const newTotal = movieRating * totalRatings - (userRating?.rate || 0);
      const newCount = totalRatings - 1;
      const newAverage = newCount > 0 ? newTotal / newCount : 0;

      setUserRating(null);
      setHoverRating(null);
      setMovieRating(newAverage);
      setShowMessage(false);

      console.log("En eliminar: ", statistics)
    } catch (error) {
      console.error("Error eliminando la calificación", error);
    }
  };

  const handleRating = async (rating: number) => {
    if (userRating) return;

    try {
      await fetchCreateRating({ id: movie._id, rate: rating});
      await handleRate()
      const updatedStats = await handleStatistics()

      const totalRatings = updatedStats?.totalRatings ?? 0;
      const newTotal = updatedStats.averageRating * totalRatings + rating;
      const newCount = totalRatings + 1;
      const newAverage = newTotal / newCount;

      setMovieRating(newAverage);
      setShowMessage(true);
      console.log("En crear: ", updatedStats)
    } catch (error) {
      console.log("Error creando calificacion");
    }
  };

  useEffect(() => {
    if (statistics) {
      console.log("Se actualizaron las estadísticas:", statistics);
    }
  }, [statistics]);

  useEffect(() => {
    if (!userRating) return;
    const refreshStats = async () => {
      const updated = await handleStatistics();
      setStatistics(updated);
    };
    refreshStats();
  }, [userRating]);

  return (
    <div className="text-white space-y-6">
      
      {/* Average Rating */}
      <div>
        <h2 className="text-lg font-semibold mb-1">Valoraciones</h2>

        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold">
            {statistics
              ? statistics.averageRating.toFixed(1)
              : movie.rating.toFixed(1)}
          </p>
          <div className="flex text-yellow-400 text-xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                fill={i < Math.round(
                  statistics ? statistics.averageRating : movie.rating
                ) ? "currentColor" : "none"}
                aria-label={`${i + 1} estrella${i === 0 ? "" : "s"}`}
              />
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-400">{statistics?.totalRatings.toLocaleString()} valoraciones</p>
      </div>

      {/* User Rating */}
      <div className="flex flex-row items-start border border-gray-600 p-4 rounded-xl justify-between">
        <div>
          <p className="text-sm font-semibold mb-1">Tu valoración</p>
          <div className="flex text-yellow-400 text-xl mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="cursor-pointer transition"
                fill={(hoverRating ?? (userRating ? userRating.rate : 0)) >= star ? "currentColor" : "none"}
                onMouseEnter={() => userRating === null && setHoverRating(star)}
                onMouseLeave={() => userRating === null && setHoverRating(null)}
                onClick={() => userRating === null && handleRating(star)}
                aria-label={`Valorar ${star} estrella${star === 1 ? "" : "s"}`}
              />
            ))}
          </div>

          {userRating ? (
            showMessage && (
              <div className="flex gap-2" role="status">
                <p className="text-white bg-gray-800 font-bold text-sm px-2 py-1 rounded">
                  {userRating.rate} estrellas
                </p>
                <p className="text-sm text-gray-400">¡Gracias por tu valoración!</p>
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500">Haz clic en una estrella para valorar</p>
          )}
        </div>

        {userRating && (
          <button
            onClick={handleRemove}
            className="text-red-500 text-xs hover:underline cursor-pointer"
            aria-label="Quitar valoración"
          >
            Quitar
          </button>
        )}
      </div>

      {/* Rating Distribution */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Distribución de valoraciones</h3>
        {statistics?.starDistribution && (
          <>
            {[
              { label: 5, key: "fiveStars" },
              { label: 4, key: "fourStars" },
              { label: 3, key: "threeStars" },
              { label: 2, key: "twoStars" },
              { label: 1, key: "oneStars" },
            ].map(({ label, key }) => {
              const starData = statistics.starDistribution[key as keyof Starts];
              return (
                <div key={label} className="flex items-center gap-2 mb-1">
                  <span className="w-3 text-sm">{label}</span>
                  <Star className="w-3 h-3 text-yellow-400" aria-hidden="true" />
                  <div className="flex flex-1 bg-gray-800 h-2 rounded overflow-hidden">
                    <div
                      className="bg-red-600 h-2 rounded"
                      style={{ width: `${starData?.percentage ?? 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{starData?.count ?? 0}</span>
                </div>
              );
            })}
          </>
        )}
      </div>

      
    </div>
  );
};

export default MovieRating;
