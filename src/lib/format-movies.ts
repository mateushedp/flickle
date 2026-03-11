import { Movie, RawMovie } from "@/types";

export function formatMovies(rawMovieArray: RawMovie[]): Omit<Movie, "id" | "createdAt" | "updatedAt" | "dailyMovies">[] {
	return rawMovieArray.map(rawMovie => ({
		title: rawMovie.title ?? "Unknown",
		poster_path: rawMovie.poster_path ?? "",
		genre: rawMovie.genres?.[0]?.name ?? "Unknown",
		release_year: parseInt(rawMovie.release_date?.substring(0, 4) ?? "0"),
		country: rawMovie.origin_country?.[0] ?? "",
		runtime: rawMovie.runtime ?? 0,
		score: Math.round(parseFloat(rawMovie.vote_average ?? "0") * 100) / 100,
		budget: rawMovie.budget ?? 0,
	}));
}