export interface Favorite {
  user_id: string;
  movie_id: string;
  createAt?: Date;
  updateAt?: Date;
}

export interface FavoriteResponse {
  isFavorite: boolean;
}