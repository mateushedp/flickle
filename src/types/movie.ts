export interface Movie {
    id: string;
    title: string;
    poster_path: string;
    genre: string;
    release_year: number;
    country: string;
    runtime: number;
    score: number;
    budget: number;
    createdAt: Date;
    updatedAt: Date;
}