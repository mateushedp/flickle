import { Movie } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Poster from "@/components/ui/poster";

interface GameResultModalProps {
	open: boolean;
	onOpenChange: (_open: boolean) => void;
	type: "success" | "failure";
	movie: Movie | null;
}

function GameResultModal({ open, onOpenChange, type, movie }: GameResultModalProps) {
	const isSuccess = type === "success";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={isSuccess ? "w-[340px] text-white bg-green-main" : "w-[340px]"}>
				<div>
					<p className="mb-8">{isSuccess ? "You got it!!!" : "Out of guesses..."}</p>
					<p>Today&apos;s movie is</p>
					{movie && (
						<>
							<div className="brutalist-box mx-auto my-3.5 truncate max-w-[180px] h-[234px] relative overflow-hidden">
								<Poster movie={movie} />
							</div>
							<p className="text-2xl font-bold break-words text-center max-w-xs mx-auto">
								{movie.title} ({movie.release_year})
							</p>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default GameResultModal;