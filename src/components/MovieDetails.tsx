import { 
  Heart, 
  MessageSquare, 
} from "lucide-react"
import { useNavigate } from "react-router";
import { 
    fetchApiCreateFavorite,
    fetchApiDeleteFavorite, 
    fetchIsFavorite 
} from "../api/favorite";
import { useEffect, useState } from "react";
import { Favorite } from "../schemas/favorite";
import { Movie } from "../schemas/movie";
import CardComment from "./CardComment";
import { fetchCreateComment } from "../api/comments";
import { InterfaceRating } from "../schemas/ratings";

export interface MovieDetails {
    _id: string | undefined;
    params: Favorite;
    movie: Movie;
    comments: InterfaceRating[];
    onCommentsUpdated: () => void;
}

export const MovieDetails = ({_id, params, movie, comments, onCommentsUpdated}: MovieDetails) => {
  const [isFavorite, SetIsFavorite] = useState<boolean>(false);
  const [textComment, setTextComment] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if(_id !== "guest") {
      //  check if a movie is favorite by a user
      const movieHasFavorite = async (params: Favorite) => {
        const response = await fetchIsFavorite(params);
        if (response.isFavorite) {
          SetIsFavorite(true)
        } else {
          SetIsFavorite(false)
        }
      }
      
      if (params.user_id !== "" && params.movie_id !== "") {
        movieHasFavorite(params);
      }
    }
  }, [params]);

  // Funtion execute when button "agregar favoritos" is click
  const handleFavorite = () => {
    // If it is not favorite
    if (_id === "guest") {navigate("/sign-in")}
    if (!isFavorite) {
        const createFavorite = async () => {
          try {
            await fetchApiCreateFavorite(params);
            SetIsFavorite(true);
            console.log("Se creo correctamente la relacion de usuario y pelicula favorita");
          } catch (error) {
            SetIsFavorite(false);
            console.log("Ocurrio un error inesperado", error);
          }
        }
        createFavorite()
    }

    // If it is favorite
    else {
        const deleteFavorite = async () => {
          try {
            await fetchApiDeleteFavorite(params);
            SetIsFavorite(false);
            console.log("Se elimino correctamente la relacion de usuario y pelicula favorita");
          } catch (error) {
            SetIsFavorite(true);
            console.log("Ocurrio un error inesperado", error);
          }
        }
        deleteFavorite();
    }
  };

  const handleComment = async () => {
    await fetchCreateComment({movie_id: movie._id, comment: textComment});
    setTextComment("");
    onCommentsUpdated();
  };

  useEffect(() => {

  }, [comments])

  return(
    <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
            <h1 className="w-full text-3xl font-semibold mb-3 sm:mb-0">{movie.title}</h1>

            {/* Botonns column (favoritos + go to catálogo) */}
            <div className="flex flex-col gap-2 mb-4">
              <button
                type="button"
                className="w-60 border border-gray-500 hover:border-red-500 hover:text-red-500 px-2 py-2 rounded flex items-center gap-2 transition cursor-pointer"
                onClick={handleFavorite}
              >
                {isFavorite ? (
                  <span className="text-red-500 flex gap-2">
                    <Heart className="text-red-500 fill-current" /> Eliminar de favoritos
                  </span>
                ) : (
                  <span className="flex gap-2">
                    <Heart className="text-white fill-current" /> Agregar a favoritos
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/catalog")}
                className="w-60 border border-gray-500 hover:border-blue-600 hover:text-white px-2 py-2 rounded flex items-center gap-2 transition cursor-pointer bg-transparent"
              >
                ← Regresar al Catálogo
              </button>
            </div>
        </div>

        {/* Tags */}
        <p className="text-sm text-gray-400 mb-2">
            <strong>Etiquetas:</strong> {movie.tags.join(", ")}
        </p>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 max-w-2xl">
            {movie.description}
        </p>

        {/* Director and Cast */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 border-b border-gray-700 pb-4">
            <div>
              <p className="font-semibold">Director</p>
              <p className="text-gray-400">
                {movie.directors.join(", ") || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-semibold">Elenco principal</p>
              <p className="text-gray-400">
                {movie.actors.join(", ") || "N/A"}
              </p>
            </div>
        </div>

          {/* === Comments Section === */}
        <div className="bg-gray-900 rounded-xl p-4 shadow-md">
            <h3 className="flex font-semibold text-lg mb-3 gap-4"> <MessageSquare className="text-red-500 fill-current" /> Comentarios ({comments.length}) </h3>

            {/* Comment Input */}
            <textarea
              value={textComment}
              onChange={(e) => setTextComment(e.target.value)}
              placeholder="¿Que opinas de esta pelicula?"
              className="w-full bg-gray-800 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
              rows={3}
            ></textarea>

            <div className="flex gap-4 p-2">
              <button
                type="button"
                onClick={handleComment}
                className="cursor-pointer bg-gray-600 rounded h-10 w-30 items-center"
              >
                Comentar
              </button>
              <button
                type="button"
                className="cursor-pointer bg-gray-500 rounded h-10 w-30 items-center"
                onClick={() => setTextComment("")}
              >
                Cancelar
              </button>
            </div>

            {/* Comments List */}
            {comments.map((comment: InterfaceRating, index) => (
              <CardComment
                key={comment.comment?._id || index} 
                comment={comment}
                onCommentsUpdated={onCommentsUpdated}
                />
            ))}
        </div>
    </div>
  );
}
