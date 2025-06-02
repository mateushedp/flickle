import prisma from "@/lib/prisma";
import { formatMovies } from "@/lib/format-movies";
import axios from "axios";

const myBearer = process.env.NEXT_PUBLIC_TMDB_BEARER;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getMovies = async (totalMovies) => {
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

		const movies = collectedMovies.slice(0, totalMovies);
		return movies;

	} catch (error) {
		console.error("Error fetching movies:", error);
	}
};

const getDetailedMovies = async (movies) => {
	const results = [];

	for (let i = 0; i < movies.length; i++) {
		const details = await getMovieDetails(movies[i]);
		results.push(details);

		// Sleep 300ms between requests to stay under 4/sec
		await sleep(300); 
	}

	return results;
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

	return movieDetails.data;
};

export default async function handler(req, res) {

	const secret = process.env.CRON_SECRET;
	const token = req.query.secret;

	if (secret !== token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const totalMovies = 1000;

		const movieList = await getMovies(totalMovies);

		const detailedMovies = await getDetailedMovies(movieList);

		const formattedMovies =  formatMovies(detailedMovies);

		await prisma.movie.deleteMany({});

		await prisma.movie.createMany({
			data: formattedMovies,
		});

		await axios.post("http://localhost:3000/api/pick-and-save-daily-movie");	

		return res.status(200).json({ success: true });
	} catch (error) {
		console.error("API error:", error);
		return res.status(500).json({ error: "Failed to fetch and store data" });
	}
}
