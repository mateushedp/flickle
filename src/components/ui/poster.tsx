import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Movie } from "@/types";

interface PosterProps {
	movie: Movie;
	showTitle?: boolean;
}

function Poster({ movie, showTitle = false }: PosterProps) {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div className="relative w-full h-full">
			{isLoading && (
				<div className="absolute inset-0 bg-neutral-300 animate-shimmer" />
			)}
			<Image
				src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
				alt={movie.title || "Movie poster"}
				fill
				className={cn(
					"background-cover object-cover transition-opacity duration-500",
					isLoading ? "opacity-0" : "opacity-100"
				)}
				onLoadingComplete={() => setIsLoading(false)}
			/>
			{showTitle && (
				<div className="w-full min-h-[30px] max-h-[60px] absolute bottom-0 border bg-white flex items-center justify-center">
					<p className="font-bold text-[12px] text-center line-clamp-3">{movie.title}</p>
				</div>
			)}
		</div>
	);
}

export default Poster;