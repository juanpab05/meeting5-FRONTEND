export type ViewMode = "categorias" | "sinOrden";

export type Movie = {
  _id: string;
  title: string;
  description: string;
  film: {
    filmURL: string;
    filmID: string;
  };
  poster: {
    posterURL: string;
    posterID: string;
  };
  subtitle: {
    spanish: string;
    english: string;
  };
  genres: string[];
  tags: string[];
  directors: string[];
  actors: string[];
  duration: number;
  releaseDate: string;
  rating: number;
};

export interface CardMovieProps {
  movie: Movie;
  onInfoClick: (movie: Movie) => void;
}

export interface PropsViewCategories{
    genre: string,
    moviesByGenre: Array<Movie>,
    setSelectedMovie: (movie: Movie | null) => void;
}

export interface PropsMovieModal {
 movie: Movie, 
 onClose: (arg0: null) => void 
 role?: string
 "aria-modal"?: string
 "aria-labelledby"?: string
}