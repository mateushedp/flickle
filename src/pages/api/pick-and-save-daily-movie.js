import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	// if (req.method !== "POST") {
	// 	return res.status(405).json({ error: "Method not allowed" });
	// }

	try {
		// Fetch all movies from the database
		const movies = await prisma.movie.findMany();

		if (movies.length === 0) {
			return res.status(404).json({ error: "No movies found in the database" });
		}

		// Pick a random movie from the database
		const randomMovie = movies[Math.floor(Math.random() * movies.length)];

		// Save the selected movie as the daily movie
		const date = new Date();
		await prisma.dailyMovie.create({
			data: {
				movieId: randomMovie.id,
				date: date,
			},
		});

		return res.status(200).json({ success: true, movieId: randomMovie.id, title: randomMovie.title });
	} catch (error) {
		console.error("Error saving daily movie:", error);
		return res.status(500).json({ error: "Failed to save daily movie" });
	}
}