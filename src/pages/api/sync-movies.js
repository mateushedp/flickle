import { PrismaClient } from "@prisma/client";
import { formatMovies } from "@/lib/format-movies";
import axios from "axios";

const prisma = new PrismaClient();
const myBearer = process.env.NEXT_PUBLIC_TMDB_BEARER;


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
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const totalMovies = 200;
		// console.time();
		const movieList = await getMovies(totalMovies);
		// console.timeEnd();
		const detailedMovies = await Promise.all(
			movieList.map(movie => getMovieDetails(movie))
		  );

		const formattedMovies =  formatMovies(detailedMovies);

		await prisma.movie.deleteMany({});

		await prisma.movie.createMany({
			data: formattedMovies,
		});

		return res.status(200).json({ success: true });
	} catch (error) {
		console.error("API error:", error);
		return res.status(500).json({ error: "Failed to fetch and store data" });
	}
}
