export interface RawMovie {
	id: number;
	title: string;
	poster_path: string;
	genres: { id: number; name: string }[];
	release_date: string;
	origin_country: string[];
	runtime: number;
	vote_average: string;
	budget: number;
}