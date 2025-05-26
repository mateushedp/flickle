import { useState } from "react";
import Image from "next/image";
import { cn } from "./../../lib/utils";


function Poster({movie}) {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div className="relative w-full h-full">
			{isLoading && 
						<div className="absolute inset-0 bg-neutral-300 animate-shimmer " />}
			<Image 
				src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`} 
				alt="Movie poster"
				fill
				className={cn(
					"background-cover object-cover transition-opacity duration-500",
					isLoading ? "opacity-0" : "opacity-100"
				)}
				onLoadingComplete={() => setIsLoading(false)}
			/>
		</div>
	);
}

export default Poster;