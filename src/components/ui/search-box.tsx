import { Search } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { Movie } from "@/types";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";
import MovieSuggestionList from "./movie-suggestion-list";

interface SearchBoxProps {
	search: string;
	setSearch: (_value: string) => void;
	filteredMovies: Movie[];
	onSelectMovie: (_movie: Movie) => Promise<void>;
	disabled?: boolean;
}

function SearchBox({ search, setSearch, filteredMovies, onSelectMovie, disabled }: SearchBoxProps) {
	const [openSuggestions, setOpenSuggestions] = useState(false);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		setOpenSuggestions(e.target.value.trim() !== "");
	};

	const handleSelectMovie = async (movie: Movie) => {
		await onSelectMovie(movie);
		setOpenSuggestions(false);
		setSearch("");
	};

	return (
		<div className="w-full h-[50px]" >
			<div className="relative w-full h-full max-w-sm" >
				< Input
					type="text"
					className="pl-9 bg-white h-full"
					placeholder="Type your guess here..." onChange={handleInputChange}
					value={search}
					disabled={disabled}
				/>
				<Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

			</div>
			< Popover open={openSuggestions} onOpenChange={setOpenSuggestions} >
				<PopoverTrigger asChild >
					<div></div>
				</PopoverTrigger>
				< PopoverContent onOpenAutoFocus={(e) => e.preventDefault()
				} className="w-[var(--radix-popover-trigger-width)]" >

					<MovieSuggestionList
						movies={filteredMovies}
						search={search}
						onSelect={handleSelectMovie}
					/>
					
				</PopoverContent>
			</Popover>

		</div>
	);
}

export default SearchBox;