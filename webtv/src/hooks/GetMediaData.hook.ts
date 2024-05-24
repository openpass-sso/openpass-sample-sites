import { useMemo } from "react";
import data from "./data/movies-by-genre.json";

export type MovieType = {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id?: number;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  release_date?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  releaseDate?: string;
  rating?: number | null;
  posterUrl?: string;
  backdropURL?: string | null;
  description?: string;
};

export type MoviesType = {
  [key: string]: MovieType[];
};

export const UseGetMediaData = () => {
  const rootData = data as MoviesType;

  const movies = useMemo(() => {
    const formatted: MoviesType = {};
    const keys = Object.keys(rootData);

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      formatted[key] = rootData[key].map((item: MovieType) => {
        return {
          description: item.overview,
          title: item.title,
          releaseDate: item.release_date,
          id: item.id,
          rating: item.vote_average || null,
          posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          backdropURL: item.backdrop_path
            ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
            : null,
        };
      });
    }
    return formatted;
  }, [rootData]);

  return { movies };
};
