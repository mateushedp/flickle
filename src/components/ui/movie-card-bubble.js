import { ChevronUp, ChevronDown } from "lucide-react"; // or your preferred icon set

function MovieCardBubble({ label, data }) {
	const { value, variant, direction } = data || {};

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
		<div className={`h-full w-full rounded-sm ${baseColor} border border-black shadow-sm flex flex-col items-center justify-center px-1 text-center`}>
			<p className={`text-sm font-antonio uppercase ${labelColor}`}>{label}</p>
			<div className="flex items-center gap-1">
				<p className={`text-[15px] font-sans font-bold ${valueColor}`}>{formatValue(value)}</p>
				{direction === "up" && <ChevronUp size={14} />}
				{direction === "down" && <ChevronDown size={14} />}
			</div>
		</div>
	);
}

export default MovieCardBubble;
