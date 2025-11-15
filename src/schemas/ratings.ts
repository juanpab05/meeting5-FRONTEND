import { Movie } from "./movie";

export interface Comment {
    _id?: string;
    user_id: string;
    movie_id: string;
    user_email: string;
    movie_title: string;
    comment: string;
}

export interface Rating {
    id?: string;
    user_id: string;
    movie_id: string;
    user_email: string;
    movie_title: string;
    rate: number;
}

export interface InterfaceRating {
    rating: any;
    rate: Rating;
    movie: Movie;
    userInfo: {user_pfp: string; user_name: string;};
    comment: Comment | null;
}