import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Movie } from "@/types";
import MovieCardBubble from "./movie-card-bubble";

interface MovieCardProps {
	selectedMovie: Movie;
	movieOfTheDay: Movie | null;
}

interface MovieCardField {
	value: string | number;
	variant?: string;
	direction?: "up" | "down";
}

interface VariantResult {
	variant: string;
	direction?: "up" | "down";
}

interface MovieCardObject {
	title: string;
	genre: MovieCardField;
	release_year: MovieCardField;
	country: MovieCardField;
	runtime: MovieCardField;
	score: MovieCardField;
	budget: MovieCardField;
}

const getVariantByThreshold = (selected: number, actual: number, threshold: number): VariantResult => {
	const direction = selected > actual ? "down" : "up";
	if (selected === actual) return { variant: "success" };
	if (Math.abs(selected - actual) < threshold) return { variant: "close", direction };
	return { variant: "", direction };
};

const getVoteAvgVariant = (selected: number, actual: number): VariantResult => {
	const direction = selected > actual ? "down" : "up";
	if (selected === actual) return { variant: "success" };
	if (Math.floor(selected) === Math.floor(actual)) return { variant: "close", direction };
	return { variant: "", direction };
};

const getBudgetVariant = (selected: number, actual: number): VariantResult => {
	const direction = selected > actual ? "down" : "up";
	if (selected === actual) return { variant: "success" };
	const percentageDiff = Math.abs(selected - actual) / ((selected + actual) / 2);
	if (percentageDiff < 0.25) return { variant: "close", direction };
	return { variant: "", direction };
};


const compareMovies = (selectedMovie: Movie, movieOfTheDay: Movie, movieObject: MovieCardObject ) => {

	movieObject.country.variant = selectedMovie.country === movieOfTheDay.country ? "success" : "";
	movieObject.genre.variant = selectedMovie.genre === movieOfTheDay.genre ? "success" : "";
	movieObject.release_year = {
		...movieObject.release_year,
		...getVariantByThreshold(selectedMovie.release_year, movieOfTheDay.release_year, 10),
	};

	movieObject.budget = {
		...movieObject.budget,
		...getBudgetVariant(selectedMovie.budget, movieOfTheDay.budget),
	};

	movieObject.score = {
		...movieObject.score,
		...getVoteAvgVariant(selectedMovie.score, movieOfTheDay.score),
	};

	movieObject.runtime = {
		...movieObject.runtime,
		...getVariantByThreshold(selectedMovie.runtime, movieOfTheDay.runtime, 10),
	};

};

function MovieCard({selectedMovie, movieOfTheDay}: MovieCardProps) {
	const [isLoading, setIsLoading] = useState(true);

	const movieObject: MovieCardObject = {
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
		<div className="bg-white text-black w-full h-[150px] border-2 border-black rounded-xl p-2.5 flex gap-2.5">
			{/* movie poster */}
			
			<div className="brutalist-box h-full w-[101px] relative overflow-hidden">
				{selectedMovie.poster_path &&
				<div className="relative w-full h-full">
					{isLoading && 
					<div className="absolute inset-0 bg-neutral-300 animate-shimmer " />}

					<Image 
						src={`https://image.tmdb.org/t/p/w780${selectedMovie.poster_path}`} 
						alt={selectedMovie.title || "Movie poster"}
						fill
						className={cn(
							"background-cover object-cover transition-opacity duration-500",
							isLoading ? "opacity-0" : "opacity-100"
						)}
						onLoadingComplete={() => setIsLoading(false)}
					/>
				</div>
				 
				}
				<div className="w-full min-h-[30px] max-h-[60px] absolute bottom-0 border bg-white flex items-center justify-center">
					<p className="font-bold text-[12px] text-center line-clamp-3">{selectedMovie.title}</p>
				</div>
			</div>

			<div className="h-full w-[218px] flex flex-col gap-[5px]">
				<div className="flex gap-[5px] w-full h-1/2">
					<MovieCardBubble label="Genre" data={movieObject.genre} />
					<MovieCardBubble label="Runtime" data={movieObject.runtime} />
				</div>
				
				<div className="flex gap-[5px] w-full h-1/2">
					<MovieCardBubble label="Country" data={movieObject.country}/>
				 	<MovieCardBubble label="Date" data={movieObject.release_year}/>
					<MovieCardBubble label="Score" data={movieObject.score}/>
				</div>
			</div>
		</div>
	);
}

export default MovieCard;