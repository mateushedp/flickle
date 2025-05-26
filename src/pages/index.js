/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog";
import MovieCard from "@/components/ui/movie-card";
import SearchBox from "@/components/ui/search-box";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "@/components/ui/confetti";
import Image from "next/image";
import prisma from "@/lib/prisma";


export async function getServerSideProps() {
	const movies = await prisma.movie.findMany();

	const cleanedMovies = movies.map(movie => {
		const { createdAt, updatedAt, ...cleanedMovie } = movie;
		return cleanedMovie;
	});

	const dailyMovie = await prisma.dailyMovie.findFirst({
		orderBy: { date: "desc" },
		include: {
			movie: true,
		},
	});

	// Clean up Date fields in dailyMovie
	if (dailyMovie) {
		delete dailyMovie.movie.createdAt;
		delete dailyMovie.movie.updatedAt;
		delete dailyMovie.date;
	}

	return {
		props: {
			movies: cleanedMovies,
			movieOfTheDay: dailyMovie?.movie || null,
		},
	};
}

function Home({movies, movieOfTheDay}) {

	const [selectedMovies, setSelectedMovies] = useState([]);
	const [tries, setTries] = useState(0);

	const [search, setSearch] = useState("");

	const [hasWon, setHasWon] = useState(false);
	const [hasLost, setHasLost] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showFailModal, setShowFailModal] = useState(false);
	
	const maxTries = 10;

	const checkGameStatus = (movies, tries) => {
		const hasWon = movies ? movies.some((movie) => movie.title === movieOfTheDay.title) : false;
		const hasLost = tries >= maxTries && !hasWon;

		if (hasWon) {
			setHasWon(true);
			setShowSuccessModal(true);
		} else if (hasLost) {
			setHasLost(true);
			setShowFailModal(true);
		}
	};

	const onSelectMovie = (movie) => {
		if (hasWon || hasLost || selectedMovies.find((m) => m.title === movie.title)) return;

		const updatedMovies = [movie, ...selectedMovies];
		const updatedTries = tries + 1;
		
		setSelectedMovies(updatedMovies);
		setTries(updatedTries);

		checkGameStatus(updatedMovies, updatedTries);
	};

	useEffect(() => {
		const savedMovies = JSON.parse(localStorage.getItem("savedMovies"));
		const savedTries = JSON.parse(localStorage.getItem("savedTries"));
		
		checkGameStatus(savedMovies, savedTries);

		if (savedMovies) setSelectedMovies(savedMovies);
		if (savedTries) setTries(savedTries);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		localStorage.setItem("savedMovies", JSON.stringify(selectedMovies));
		// const savedMovies = JSON.parse(localStorage.getItem("savedMovies"));
	}, [selectedMovies]);

	useEffect(() => {
		localStorage.setItem("savedTries", JSON.stringify(tries));
		// const savedTries = JSON.parse(localStorage.getItem("savedTries"));
	}, [tries]);

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
			<Dialog open={showFailModal} onOpenChange={setShowFailModal} >
				<DialogContent className="w-[340px]">
					<div>
						<p className="mb-8">Out of guesses...</p>
						<p>Today&apos;s movie is</p>
						{movieOfTheDay  &&
									<>
										<div className="brutalist-box mx-auto my-3.5 truncate max-w-[180px] h-[234px] relative overflow-hidden">
											<Image 
												src={`https://image.tmdb.org/t/p/original${movieOfTheDay.poster_path}`} 
												alt="Movie poster"
												className="background-cover"
												fill
											/>
										</div>
										<p className="text-2xl font-bold break-words text-center max-w-xs mx-auto">
											{movieOfTheDay.title} ({movieOfTheDay.release_year})
										</p>
									</>
						}
					</div>
				</DialogContent>
			</Dialog>
			
			{showSuccessModal &&
				<Confetti />
			}
			
			<Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal} >
				<DialogContent className="w-[340px] text-white bg-green-main">
					<div>
						<p className="mb-8">You got it!!!</p>
						<p>Today&apos;s movie is</p>
						{movieOfTheDay  &&
									<>
										<div className="brutalist-box mx-auto my-3.5 truncate max-w-[180px] h-[234px] relative overflow-hidden">
											<Image 
												src={`https://image.tmdb.org/t/p/original${movieOfTheDay.poster_path}`} 
												alt="Movie poster"
												className="background-cover"
												fill
											/>
										</div>
										<p className="text-2xl font-bold break-words text-center max-w-xs mx-auto">
											{movieOfTheDay.title} ({movieOfTheDay.release_year})
										</p>
									</>
						}
					</div>
				</DialogContent>
			</Dialog>

			{/* main container */}
			<div className="w-[384px] px-[22px] h-full flex flex-col items-center">
				{/* header */}
				<div className="absolute w-dvw h-[255px] bg-black pt-3">
					

				</div>
				<div className="relative top-0 w-full">
					<h1 className="font-pacifico text-[64px] text-white text-center">Flickle</h1>
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
					{movieOfTheDay && 
						<MovieCard key={movieOfTheDay.id} selectedMovie={movieOfTheDay} movieOfTheDay={movieOfTheDay}/>
					}
					<p className="font-bold text-black text-[18px] text-end my-[16px]">Guesses: {tries}/{maxTries}</p>
					<div className="flex flex-col gap-4">
						{hasLost && 
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