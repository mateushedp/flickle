import MovieCardBubble from "./movie-card-bubble";
import Image from "next/image";

function MovieCard({selectedMovie, movieOfTheDay}) {

	const getArraySimilarityVariant = (array1, array2, key) => {
		const values1 = key ? array1.map(item => item[key]) : array1;
		const values2 = key ? array2.map(item => item[key]) : array2;
	
		const set1 = new Set(values1);
		const set2 = new Set(values2);
	
		const commonItems = [...set1].filter(item => set2.has(item));
	
		if (set1.size === set2.size && commonItems.length === set1.size) {
			return "success"; // exact same items
		}
	
		if (commonItems.length > 0) {
			return "close"; // some overlap
		}
	
		return "default"; // no overlap
	};

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

		movieObject.origin_country.variant = getArraySimilarityVariant(selectedMovie.origin_country, movieOfTheDay.origin_country);
		movieObject.genres.variant = getArraySimilarityVariant(selectedMovie.genres, movieOfTheDay.genres, "name");
		movieObject.release_date.variant = getReleaseDateVariant(selectedMovie.release_date, movieOfTheDay.release_date);
		movieObject.budget.variant = getBudgetVariant(selectedMovie.budget, movieOfTheDay.budget);
		movieObject.vote_average.variant = getVoteAvgVariant(selectedMovie.vote_average, movieOfTheDay.vote_average);
		movieObject.runtime.variant = getRuntimeVariant(selectedMovie.runtime, movieOfTheDay.runtime);
	};

	const movieObject = {
		title: selectedMovie.title ?? " - ",
		origin_country: {value: selectedMovie.origin_country ?? " - "},
		genres: {value: selectedMovie.genres[0].name},
		release_date: {value: selectedMovie.release_date.substring(0, 4)},
		vote_average: {value: parseFloat(selectedMovie.vote_average).toFixed(2)},
		runtime: {value: selectedMovie.runtime + " min"},
		budget: {value: "$" + selectedMovie.budget.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2})}
	};

	if(movieOfTheDay){
		compareMovies(selectedMovie, movieOfTheDay, movieObject);
	}

	console.log(selectedMovie.poster_path);
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
					<MovieCardBubble label={"Genre"} value={movieObject.genres.value} variant={movieObject.genres.variant}/>
					<MovieCardBubble label={"Runtime"} value={movieObject.runtime.value} variant={movieObject.runtime.variant}/>
				</div>
				<div className="flex gap-[5px] w-full h-1/2">
					<MovieCardBubble label={"Country"} value={movieObject.origin_country.value} variant={movieObject.origin_country.variant}/>
				 	<MovieCardBubble label={"Date"} value={movieObject.release_date.value} variant={movieObject.release_date.variant}/>
					<MovieCardBubble label={"Score"} value={movieObject.vote_average.value} variant={movieObject.vote_average.variant}/>
				</div>
			</div>
		</div>
		// <Card key={movieObject.id} className="bg-white text-black w-full h-[300px]">
		// 	<CardHeader>
		// 		<CardTitle>{movieObject.title}</CardTitle>
		// 	</CardHeader>
		// 	<CardContent className="px-0">
		// 		<div className="flex justify-between gap-2 flex-wrap">
		// 			<MovieCardBubble label={"Country"} value={movieObject.origin_country.value} variant={movieObject.origin_country.variant}/>
		// 			<MovieCardBubble label={"Genre"} value={movieObject.genres.value} variant={movieObject.genres.variant}/>
		// 			<MovieCardBubble label={"Release Date"} value={movieObject.release_date.value} variant={movieObject.release_date.variant}/>
		// 			<MovieCardBubble label={"Vote Average"} value={movieObject.vote_average.value} variant={movieObject.vote_average.variant}/>
		// 			<MovieCardBubble label={"Runtime"} value={movieObject.runtime.value} variant={movieObject.runtime.variant}/>
		// 			<MovieCardBubble label={"Budget"} value={movieObject.budget.value} variant={movieObject.budget.variant}/>
		// 		</div>
		// 	</CardContent>
		// </Card>
	);
}

export default MovieCard;