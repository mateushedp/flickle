import { useState, useEffect } from "react";
import { isSameDay, parseISO, format } from "date-fns";
import { Movie } from "@/types";


export function useGameState(movieOfTheDay: Movie | null) {

	const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
	const [tries, setTries] = useState(0);

	const [hasWon, setHasWon] = useState(false);
	const [hasLost, setHasLost] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showFailModal, setShowFailModal] = useState(false);

	const maxTries = 10;

	const checkGameStatus = (updatedMovies: Movie[], updatedTries: number) => {
		const won = updatedMovies ? updatedMovies.some((movie) => movie.title === movieOfTheDay?.title) : false;
		const lost = updatedTries >= maxTries && !won;

		if (won) {
			setHasWon(true);
			setShowSuccessModal(true);
		} else if (lost) {
			setHasLost(true);
			setShowFailModal(true);
		}
	};

	const saveGame = (movies: Movie[], tries: number) => {
		const today = format(new Date(), "yyyy-MM-dd");
		localStorage.setItem("savedMovies", JSON.stringify(movies));
		localStorage.setItem("savedTries", JSON.stringify(tries));
		localStorage.setItem("savedDate", today);
	};

	const onSelectMovie = (movie: Movie) => {
		if (hasWon || hasLost || selectedMovies.some((m) => m.title === movie.title)) return;

		const updatedMovies = [movie, ...selectedMovies];
		const updatedTries = tries + 1;
		
		setSelectedMovies(updatedMovies);
		setTries(updatedTries);
		saveGame(updatedMovies, updatedTries);
		checkGameStatus(updatedMovies, updatedTries);
	};

	useEffect(() => {
		const savedDateStr = localStorage.getItem("savedDate");
		const today = new Date();
	
		const savedMovies = JSON.parse(localStorage.getItem("savedMovies") ?? "[]") as Movie[];
		const savedTries = JSON.parse(localStorage.getItem("savedTries") ?? "0") as number;
	
		const isValid = savedDateStr && isSameDay(parseISO(savedDateStr), today);
	
		if (isValid) {
			checkGameStatus(savedMovies, savedTries);
	
			if (savedMovies) setSelectedMovies(savedMovies);
			if (savedTries) setTries(savedTries);
		} else {
			// Clear outdated data
			localStorage.removeItem("savedMovies");
			localStorage.removeItem("savedTries");
			localStorage.removeItem("savedDate");
	
			// Optional: reset states if needed
			setSelectedMovies([]);
			setTries(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		selectedMovies,
		tries,
		hasWon,
		hasLost,
		showSuccessModal,
		showFailModal,
		setShowSuccessModal,
		setShowFailModal,
		onSelectMovie,
	};
}