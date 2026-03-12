import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GetServerSideProps } from "next";
import MovieCard from "@/components/ui/movie-card";
import SearchBox from "@/components/ui/search-box";
import Confetti from "@/components/ui/confetti";
import { Movie } from "@/types";
import prisma from "@/lib/prisma";
import GameResultModal from "@/components/ui/game-result-modal";
import { useGameState } from "@/hooks/useGameState";

export const getServerSideProps: GetServerSideProps = async () => {
	const movies = await prisma.movie.findMany();

	const cleanedMovies = movies.map(movie => {
		const { createdAt: _createdAt, updatedAt: _updatedAt, ...cleanedMovie } = movie;
		return cleanedMovie;
	});

	const dailyMovie = await prisma.dailyMovie.findFirst({
		orderBy: { date: "desc" },
		include: {
			movie: true,
		},
	});

	const movieOfTheDay = dailyMovie?.movie
		? (({ createdAt: _createdAt, updatedAt: _updatedAt, ...rest }) => rest)(dailyMovie.movie)
		: null;

	return {
		props: {
			movies: cleanedMovies,
			movieOfTheDay,
		},
	};
};

interface HomeProps {
	movies: Movie[];
	movieOfTheDay: Movie | null;
}

function Home({ movies, movieOfTheDay }: HomeProps) {

	const {
		selectedMovies,
		tries,
		hasWon,
		hasLost,
		showSuccessModal,
		showFailModal,
		setShowSuccessModal,
		setShowFailModal,
		onSelectMovie,
	} = useGameState(movieOfTheDay);

	const [search, setSearch] = useState("");
	
	const maxTries = 10;

	const filteredMovies =
    search.trim() === ""
    	? []
    	: movies
    		.filter(movie =>
    			movie.title.toLowerCase().includes(search.toLowerCase())
    		)
    		.slice(0, 5);

	return (
		<div className="max-w-full min-h-screen bg-white flex flex-col items-center">
			
			{showSuccessModal &&
				<Confetti />
			}
			
			<GameResultModal
				open={showFailModal}
				onOpenChange={setShowFailModal}
				type="failure"
				movie={movieOfTheDay}
			/>

			<GameResultModal
				open={showSuccessModal}
				onOpenChange={setShowSuccessModal}
				type="success"
				movie={movieOfTheDay}
			/>

			{/* main container */}
			<div className="w-[384px] px-[22px] h-full flex flex-col items-center">
				{/* header */}
				<div className="absolute w-full h-[255px] bg-black pt-3">
					

				</div>
				<div className="relative top-0 w-full">
					<h1 className="font-pacifico text-[64px] text-white text-center">Reelie</h1>
					<div className="font-antonio text-[18px] text-white text-center my-5">
						<p>Guess the movie of the day!</p>
						<p><span className="text-yellow-main">Yellow</span> means you&apos;re close,</p>
						<p><span className="text-green-main">Green</span> means it&apos;s a match.</p>
					</div>
					
					<div className="w-full flex justify-center mt-[31px]">
						<SearchBox
							search={search}
							setSearch={setSearch}
							filteredMovies={filteredMovies}
							onSelectMovie={onSelectMovie}
							disabled={hasWon || hasLost}
						/>
					</div>
				</div>

				{/* body */}
				<div className=" w-full my-[32px]">
					{/* {movieOfTheDay && 
						<MovieCard key={movieOfTheDay.id} selectedMovie={movieOfTheDay} movieOfTheDay={movieOfTheDay}/>
					} */}
					<p className="font-bold text-black text-[18px] text-end my-[16px]">Guesses: {tries}/{maxTries}</p>
					<div className="flex flex-col gap-4">
						{hasLost && movieOfTheDay &&
						<MovieCard key={movieOfTheDay.id} selectedMovie={movieOfTheDay} movieOfTheDay={movieOfTheDay}/>
						}
						<AnimatePresence initial={false}>

							{selectedMovies.length > 0 &&
								selectedMovies.map((movie) => (
									<motion.div
										key={movie.id}
										initial={{ opacity: 0, y: -20 }}   // start slightly above
										animate={{ opacity: 1, y: 0 }}     // animate to natural position
										exit={{ opacity: 0, y: 20 }}       // animate out down (optional)
										transition={{ duration: 0.6 }}
									>
										<MovieCard selectedMovie={movie} movieOfTheDay={movieOfTheDay} />
									</motion.div>
								))}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;