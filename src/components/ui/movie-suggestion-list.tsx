import { Movie } from "@/types";

interface MovieSuggestionListProps {
    movies: Movie[];
    search: string;
    onSelect: (_movie: Movie) => Promise<void>;
}

function MovieSuggestionList({ movies, search, onSelect }: MovieSuggestionListProps) {

	return (
		movies.length > 0 ?
			<div className="flex flex-col justify-center font-allerta ">
				{
					movies.map((movie) => (
						<p className="w-full p-2 hover:bg-accent hover:cursor-pointer text-base md:text-sm"
							key={movie.id}
							onClick={() => onSelect(movie)}
						>
							{movie.title}
						</p>
					))
				}
			</div>
			:
			search.trim() !== "" ? (
				<p>No results found.</p>
			) : null

	);
}

export default MovieSuggestionList;