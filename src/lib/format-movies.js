export function formatMovies(rawMovieArray) {

	return rawMovieArray.map(rawMovie => ({
		title: rawMovie.title,
		poster_path: rawMovie.poster_path,
		genre: rawMovie.genres[0].name,
		release_year: parseInt(rawMovie.release_date.substring(0, 4)),
		country: rawMovie.origin_country.length ? rawMovie.origin_country[0] : null,
		runtime: rawMovie.runtime,
		score: Math.round(parseFloat(rawMovie.vote_average) * 100) / 100,
		budget: rawMovie.budget,
	}));

}