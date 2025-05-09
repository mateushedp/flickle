import MovieCardBubble from "./movie-card-bubble";
import Image from "next/image";

function MovieCard({selectedMovie, movieOfTheDay}) {

	const getReleaseDateVariant = (selectedMovieDate, movieOfTheDayDate) => {
		if(selectedMovieDate === movieOfTheDayDate) return "success";
		//checks if they are on the same decade
		if(Math.floor(new Date(selectedMovieDate).getFullYear() / 10) === Math.floor(new Date(movieOfTheDayDate).getFullYear() / 10)){
			return "close";
		}
	};

	const getVoteAvgVariant = (selectedMovieAvg, movieOfTheDayAvg) => {
		if(selectedMovieAvg === movieOfTheDayAvg) return "success";
		if(Math.floor(selectedMovieAvg) === Math.floor(movieOfTheDayAvg)) return "close";
	};

	const getRuntimeVariant = (selectedMovieRuntime, movieOfTheDayRuntime) => {
		if(selectedMovieRuntime === movieOfTheDayRuntime) return "success";
		if(Math.abs(selectedMovieRuntime - movieOfTheDayRuntime) < 10) return "close";

	};

	const getBudgetVariant = (selectedMovieBudget, movieOfTheDayBudget) => {
		if(selectedMovieBudget === movieOfTheDayBudget) return "success";
		const diff = Math.abs(selectedMovieBudget - movieOfTheDayBudget);
		const avg = (selectedMovieBudget + movieOfTheDayBudget) / 2;

		const percentageDiff = diff / avg;

		if (percentageDiff < 0.25) return "close";   // within 25%
	};

	const compareMovies = (selectedMovie, movieOfTheDay, movieObject) => {

		movieObject.country.variant = selectedMovie.country === movieOfTheDay.country ? "success" : "";
		movieObject.genre.variant = selectedMovie.genre === movieOfTheDay.genre ? "success" : "";
		movieObject.release_year.variant = getReleaseDateVariant(selectedMovie.release_year, movieOfTheDay.release_year);
		movieObject.budget.variant = getBudgetVariant(selectedMovie.budget, movieOfTheDay.budget);
		movieObject.score.variant = getVoteAvgVariant(selectedMovie.score, movieOfTheDay.score);
		movieObject.runtime.variant = getRuntimeVariant(selectedMovie.runtime, movieOfTheDay.runtime);

	};

	const movieObject = {
		title: selectedMovie.title ?? " - ",
		genre: {value: selectedMovie.genre ?? " - "},
		release_year: {value: selectedMovie.release_year ?? " - "},
		country: {value: selectedMovie.country ?? " - "},
		runtime: {value: selectedMovie.runtime + " min"},
		score: {value: selectedMovie.score},
		budget: {value: "$" + selectedMovie.budget.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}
	};

	if(movieOfTheDay){
		compareMovies(selectedMovie, movieOfTheDay, movieObject);
	}

	return (
		<div key={movieObject.id} className="bg-white text-black w-full h-[150px] border-2 border-black rounded-xl p-2.5 flex gap-2.5">
			{/* movie poster */}
			
			<div className="brutalist-box h-full w-[101px] relative overflow-hidden">
				{selectedMovie && selectedMovie.poster_path &&
				<Image 
					src={`https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`} 
					alt=""
					fill
					className="background-cover"
				/>
				}
				<div className="w-full min-h-[30px] max-h-[60px] absolute bottom-0 border bg-white flex items-center justify-center">
					<p className="font-bold text-[12px] text-center line-clamp-3">{selectedMovie.title}</p>
				</div>
			</div>

			<div className="h-full w-[218px] flex flex-col gap-[5px]">
				<div className="flex gap-[5px] w-full h-1/2">
					<MovieCardBubble label={"Genre"} value={movieObject.genre.value} variant={movieObject.genre.variant}/>
					<MovieCardBubble label={"Runtime"} value={movieObject.runtime.value} variant={movieObject.runtime.variant}/>
				</div>
				<div className="flex gap-[5px] w-full h-1/2">
					<MovieCardBubble label={"Country"} value={movieObject.country.value} variant={movieObject.country.variant}/>
				 	<MovieCardBubble label={"Date"} value={movieObject.release_year.value} variant={movieObject.release_year.variant}/>
					<MovieCardBubble label={"Score"} value={movieObject.score.value} variant={movieObject.score.variant}/>
				</div>
			</div>
		</div>
	);
}

export default MovieCard;