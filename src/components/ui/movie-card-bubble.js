/* eslint-disable @next/next/no-img-element */
import { ChevronUp, ChevronDown } from "lucide-react"; // or your preferred icon set
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

function MovieCardBubble({ label, data }) {
	const { value, variant, direction } = data || {};
	const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

	const formatValue = (val) => {
		if (Array.isArray(val)) {
			if (val.length > 0 && typeof val[0] === "object" && "name" in val[0]) {
				return val.map(item => item.name).join(", ");
			}
			return val.join(", ");
		}

		return val ?? "N/A";
	};

	const baseColor = variant === "success"
		? "bg-green-main text-white"
		: variant === "close"
			? "bg-yellow-main"
			: "bg-white";

	const labelColor = variant === "success" ? "text-white" : "text-gray-900";
	const valueColor = variant === "success" ? "text-white" : "text-black";

	return (
		<div className={`h-full w-full rounded-sm ${baseColor} border border-black shadow-sm flex flex-col items-center px-1 text-center pt-[6px]`}>
			<p className={`text-sm font-antonio uppercase ${labelColor}`}>{label}</p>
			<div className="flex items-center gap-1 flex-1 justify-center">
				{label === "Country" ? (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<div className="flex flex-col items-center">
									<img
										alt="United States"
										className="w-[40px] h-[20px]"
										src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}/>
									<p className="text-[10px]">{value}</p>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{value ? regionNames.of(value) : ""}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					
				) : (
					<>
						<p className={`text-[15px] font-sans font-bold ${valueColor}`}>{formatValue(value)}</p>
						{direction === "up" && <ChevronUp size={14} />}
						{direction === "down" && <ChevronDown size={14} />}
					</>
				)}
			</div>
		</div>
	);
}

export default MovieCardBubble;
