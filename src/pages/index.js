import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog";
import MovieCard from "@/components/ui/movie-card";
import SearchBox from "@/components/ui/search-box";
import Image from "next/image";
import axios from "axios";

function Home() {

	const [movies, setMovies] = useState([]);
	const [movieOfTheDay, setMovieOfTheDay] = useState();
	const [selectedMovies, setSelectedMovies] = useState([]);
	const [search, setSearch] = useState("");

	const [gameOver, setGameOver] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showFailModal, setShowFailModal] = useState(false);
	
	const [tries, setTries] = useState(0);
	const maxTries = 3;

  
	const myBearer = process.env.NEXT_PUBLIC_TMDB_BEARER;
	const totalMovies = 100;

	const getMovies = async () => {
		let collectedMovies = [];
		let page = 1;

		try {
			while (collectedMovies.length < totalMovies) {
				const result = await axios({
					method: "GET",
					url: `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
					headers: {
						accept: "application/json",
						Authorization: "Bearer " + myBearer
					}
				});

				collectedMovies.push(...result.data.results);

				if (result.data.results.length < 20) break;

				page++;
			}

			setMovies(collectedMovies.slice(0, totalMovies));

		} catch (error) {
			console.error("Error fetching movies:", error);
		}
	};

	const getRandomMovie = () => {
		const randomIndex = Math.floor(Math.random() * movies.length);
		return movies[randomIndex];
	};

	const getMovieDetails = async (movie) => {
		
		const movieDetails = await axios({
			method: "GET",
			url: `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
			headers: {
				accept: "application/json",
				Authorization: "Bearer " + myBearer
			}
		});

		console.log(movieDetails.data);
		return movieDetails.data;
	};

	const getMovieOfTheDay = async () => {
		const randomMovie = getRandomMovie();
		const randomMovieDetails = await getMovieDetails(randomMovie);
		//checar se existe filme etc.
		
		setMovieOfTheDay(randomMovieDetails);
	};

	const onSelectMovie = async (movie) => {
		if (gameOver) return;
	  
		const movieDetails = await getMovieDetails(movie);
		setSelectedMovies(prev => [movieDetails, ...prev]);
	  
		const isCorrect = movieDetails.title === movieOfTheDay.title;
	  
		if (isCorrect) {
		  setGameOver(true);
		  setShowSuccessModal(true);
		  return;
		}
	  
		const newTries = tries + 1;
		setTries(newTries);
	  
		if (newTries >= maxTries) {
		  setGameOver(true);
		  setShowFailModal(true);
		}
	  };

	const filteredMovies =
    search.trim() === ""
    	? []
    	: movies
    		.filter(movie =>
    			movie.title.toLowerCase().includes(search.toLowerCase())
    		)
    		.slice(0, 5);

	useEffect(() => {
		getMovies();
		
	}, []);

	useEffect(() => {
		if(movies.length > 0) getMovieOfTheDay();
	}, [movies]);

	useEffect(() => {
		console.log(selectedMovies);
	}, [selectedMovies]);

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
											{movieOfTheDay.title} ({movieOfTheDay.release_date.substring(0, 4)})
										</p>
									</>
						}
					</div>
				</DialogContent>
			</Dialog>
			
			
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
											{movieOfTheDay.title} ({movieOfTheDay.release_date.substring(0, 4)})
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
							disabled={gameOver}
						/>
					</div>
				</div>

				{/* body */}
				<div className=" w-full my-[32px]">
					<div>
						<p className="font-bold text-black text-[18px] text-end my-[16px]">Guesses: {tries}/{maxTries}</p>
						
						{/* {movieOfTheDay && 
								<MovieCard selectedMovie={movieOfTheDay}/>
						}	 */}
							
						{selectedMovies.length > 0 && selectedMovies.map(movie => {
							return <MovieCard key={movie.id} selectedMovie={movie} movieOfTheDay={movieOfTheDay}/>;
						})
			
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;