import { useParams } from "react-router"
import { useEffect, useState } from "react";
import { fetchApiMovie } from "../api/movie";
import { getIdUser } from "../api/utils";
import { Favorite } from "../schemas/favorite";
import { Movie } from "../schemas/movie";
import VideoPlayer from "./VideoPlayer";
import { useUser } from "../context/UserContext";
import { MovieDetails } from "./MovieDetails";
import { MovieStatistics } from "./MovieStatistics";
import { InterfaceRating } from "../schemas/ratings";
import { fetchGetComments } from "../api/comments";

export const ViewMovie = () => {
  const { id } = useParams<string>();
  const [params, setParams] = useState<Favorite>({user_id: "", movie_id: ""});
  const [comments, setComments] = useState<InterfaceRating[]>([]);
  const {user} = useUser();
  const [movie, setMovie] = useState<Movie>({
    _id: "",
    title: "",
    description: "",
    film: { filmURL: "", filmID: "" },
    poster: { posterURL: "", posterID: "" },
    subtitle: { spanish: "", english: ""},
    genres: [],
    tags: [],
    directors: [],
    actors: [],
    duration: 0,
    releaseDate: "",
    rating: 0,
  });

  {/** Get Movie'Comments */}
  const fetchComments = async () => {
    const response = await fetchGetComments(id!);
    setComments(response);
  }

  useEffect(() => {
    {/** Get Movie'Info */}
    const fetchMovie = async () => {
      if (id) {
        const Movie: Movie = await fetchApiMovie(id);
        setMovie(Movie);
      }
    };
    fetchMovie();
    fetchComments();
    
    if (id !== undefined) {
      const params = { user_id: getIdUser(), movie_id: id }
      setParams(params);
    }
  }, []);

  // const handleCommentsUpdated = async () => {
  //   await fetchComments();
  // };
  
  return (
    <div 
      className="
      min-h-screen bg-black text-white flex flex-col items-center 
      mt-19
      sm:mt-0
      "
    >
      {/* === Main Video === */}
      <VideoPlayer src={movie.film.filmURL} subtitles={movie.subtitle}/>

      {/* === Movie Info Section === */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between gap-6 mt-6 p-4">
        
        {/* === Left Column === */}
        {movie?._id  && comments && (
          <MovieDetails 
            _id={user?._id} 
            params={params} 
            movie={movie} 
            comments={comments}
            onCommentsUpdated={fetchComments}
            />
          )}

        {/* Right Column */}
        {id && (
          <MovieStatistics 
            idMovie={id} 
            movie={movie}
            onStatisticsChange={fetchComments}
            />
        )}
      </div>
    </div>
  );
};