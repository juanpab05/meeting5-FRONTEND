import { PropsViewCategories } from "../schemas/movie";
import CardMovie from "./CardMovie";

export const ViewCategories = ({ genre, moviesByGenre, setSelectedMovie }: PropsViewCategories) => {
    return (
        <div key={genre} className="mb-8 relative" role="region" aria-labelledby={`genre-${genre}`}>
            <h3 id={`genre-${genre}`} className="text-2xl font-semibold mb-3">
                {genre}
            </h3>
            <div
                className="flex gap-4 overflow-auto pb-2 scrollbar-thin scrollbar-track-black scrollbar-thumb-white"
                role="list"
                aria-label={`Películas en la categoría ${genre}`}
            >
                {moviesByGenre.map((movie) => (
                    <div key={movie._id} className="flex-shrink-0" role="listitem">
                        <CardMovie
                            movie={movie}
                            class_name="group relative w-44 h-64 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-110 hover:z-10 shadow-md hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-500"
                            onInfoClick={(m) => setSelectedMovie(m)}
                            aria-label={`Información de la película ${movie.title}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewCategories;