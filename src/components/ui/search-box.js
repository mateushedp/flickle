import { Input } from "./input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Search } from "lucide-react";
import { useState } from "react";

function SearchBox({search, setSearch, filteredMovies, onSelectMovie, disabled}) {
	const [openSuggestions, setOpenSuggestions] = useState(false);

	const handleInputChange = (e) => {
		setSearch(e.target.value);
		setOpenSuggestions(!!(e.target.value.trim() !== ""));
	};

	return (
		<div className="w-full h-[50px]">
			<div className="relative w-full h-full max-w-sm">
				{/* <div className="w-full h-full flex flex-col">
					<div className="flex-1 bg-white">Top Row</div>
					<div className="flex-1 bg-black">Bottom Row</div>
				</div> */}
				<Input
					type="text"
					className="pl-9 bg-white h-full"
					placeholder="Type your guess here..." onChange={handleInputChange}
					value={search}
					disabled={disabled}
				/>
				<Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

			</div>
			<Popover open={openSuggestions} onOpenChange={setOpenSuggestions}>
				<PopoverTrigger asChild>
					<div></div>
				</PopoverTrigger>
				<PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-[var(--radix-popover-trigger-width)]">
					{filteredMovies.length > 0 ? 
						<div className="flex flex-col justify-center font-allerta ">
							{filteredMovies.map((movie) => (
								<p className="w-full p-2 hover:bg-accent hover:cursor-pointer text-base md:text-sm"
									key={movie.id}
									onClick={async () => {
										await onSelectMovie(movie);
										setOpenSuggestions(false);
										setSearch("");
									}}
								>
									{movie.title}
								</p>
							))}
						</div>
						:
						search.trim() !== "" ? (
							<p>No results found.</p>
						) : null}
				</PopoverContent>
			</Popover>
			
		</div>
	);
}

export default SearchBox;