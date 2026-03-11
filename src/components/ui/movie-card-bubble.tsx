/* eslint-disable @next/next/no-img-element */
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface MovieCardBubbleProps {
	label: string;
	data: {
		value: string | number;
		variant?: string;
		direction?: "up" | "down";
	};
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function MovieCardBubble({ label, data }: MovieCardBubbleProps) {
	const { value, variant, direction } = data;

	const baseColor = variant === "success"
		? "bg-green-main text-white"
		: variant === "close"
			? "bg-yellow-main"
			: "bg-white";

	const labelColor = variant === "success" ? "text-white" : "text-gray-900";
	const valueColor = variant === "success" ? "text-white" : "text-black";

	return (
		<motion.div
			initial={{ boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)" }}
			animate={{ boxShadow: "2px 2px rgba(0, 0, 0, 0.75)" }}
			transition={{ duration: 0.8 }}
			className={`h-full w-full rounded-sm ${baseColor} border border-black flex flex-col items-center px-1 text-center pt-[6px]`}
		>
			<p className={`text-sm font-antonio uppercase ${labelColor}`}>{label}</p>
			<div className="flex items-center gap-1 flex-1 justify-center">
				{label === "Country" ? (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<div className="flex flex-col items-center">
									<img
										alt={regionNames.of(String(value)) ?? String(value)}
										className="w-[40px] h-[20px]"
										src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}/>
									<p className="text-[10px]">{value}</p>
								</div>
							</TooltipTrigger>
							<TooltipContent className="">
								<p>{value ? regionNames.of(String(value)) : ""}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					
				) : (
					<>
						<p className={`text-[15px] font-sans font-bold ${valueColor}`}>{value}</p>
						{direction === "up" && <ChevronUp size={14} />}
						{direction === "down" && <ChevronDown size={14} />}
					</>
				)}
			</div>
		</motion.div>
	);
}

export default MovieCardBubble;
