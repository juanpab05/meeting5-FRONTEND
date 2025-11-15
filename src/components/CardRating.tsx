import { Star } from "lucide-react";
import { InterfaceRating } from "../schemas/ratings";
import { useNavigate } from "react-router";
import { fetchDeleteRating } from "../api/ratings";
import { useState } from "react";

interface StarProps {
    _calificacion: InterfaceRating;
    idx: number;
    onDelete?: (id: string) => void;
}

export const CardRatings = ({ _calificacion, idx, onDelete }: StarProps) => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteRating = async () => {
        const response = confirm("¿Estás seguro de que deseas eliminar esta calificación?");
        if (response) {
            try {
                setIsDeleting(true);
                await fetchDeleteRating({ id: _calificacion.rating._id! });
                onDelete?.(_calificacion.rating._id!);
            } catch (error) {
                console.error("Error eliminando rating:", error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleEditRating = async () => {
        window.scrollTo(0, 0);
        navigate(`/view-movie/${_calificacion.movie._id}`); 
    };

    return (
        <div
            key={_calificacion?.rating?.id ?? idx}
            className="flex flex-col border border-gray-600 p-4 rounded-md gap-4"
            role="region"
            aria-labelledby={`movie-title-${idx}`}
        >
            {/** Movie Info */}
            <div className="flex flex-row gap-4">
                <img
                    onClick={() => navigate(`/view-movie/${_calificacion.movie._id}`)}
                    src={_calificacion.movie.poster.posterURL}
                    alt={`Póster de la película ${_calificacion.movie.title}`}
                    className="
                      h-[20vh] w-[15vh] cursor-pointer
                      sm:h-[40vh] sm:w-[30vh]
                    "
                />

                {/** Movie Details */}
                <div className="w-full p-2">
                    <p id={`movie-title-${idx}`} className="text-4xl font-bold text-white">
                        {_calificacion.movie.title}
                    </p>
                    <p className="text-xl text-gray-300">{_calificacion.movie.directors}</p>
                    <p className="text-gray-400">{_calificacion.movie.tags.join(", ")}</p>

                    <div
                        className="
                      flex flex-col gap-2
                      sm:flex-row sm:gap-4
                      "
                    >
                        <div className="flex" role="img" aria-label={`Calificación: ${_calificacion.rating.rate} de 5`}>
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    className={i < _calificacion.rating.rate ? "text-yellow-400 fill-current" : "text-gray-400 fill-current"}
                                />
                            ))}
                        </div>
                        <div className="flex text-white">
                            {_calificacion.rating.rate} / 5
                        </div>
                    </div>

                    {/** Comment Section */}
                    <div
                        className="
                       hidden flex text-white border h-auto p-4 rounded-md 
                       bg-[#375566]/30 my-6 w-full sm:block
                       "
                        aria-label="Reseña del usuario"
                    >
                        <p className="text-white break-all">
                            {(() => {
                                const text = _calificacion.comment ? _calificacion.comment.comment : "No hay reseña disponible.";
                                return text.length > 500 ? text.slice(0, 497) + "..." : text;
                            })()}
                        </p>
                    </div>
                </div>
            </div>

            {/** Comment Section for larger screens */}
            <div
                className="
                flex text-white border h-auto p-4 rounded-md 
                bg-[#375566]/30 my-6 w-full sm:hidden
                "
                aria-label="Reseña del usuario"
            >
                <p className="text-white break-all">
                    {(() => {
                        const text = _calificacion.comment ? _calificacion.comment.comment : "No hay reseña disponible.";
                        return text.length > 100 ? text.slice(0, 97) + "..." : text;
                    })()}
                </p>
            </div>

            {/** Buttons */}
            <div className="flex">
                <button
                    onClick={handleDeleteRating}
                    className="bg-gray-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4 cursor-pointer"
                    aria-label="Eliminar calificación"
                >
                    Eliminar calificación
                </button>
                <button
                    onClick={handleEditRating}
                    className="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                    aria-label="Editar calificación"
                >
                    Editar calificación
                </button>
            </div>
        </div>
    );
};

export default CardRatings;