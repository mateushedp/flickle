function MovieCardBubble({ label, value, variant}) {
	const formatValue = (val) => {
	  if (Array.isArray(val)) {
			if (val.length > 0 && typeof val[0] === "object" && "name" in val[0]) {
		  return val.map(item => item.name).join(", ");
			}
			return val.join(", ");
	  }
  
	  return val ?? "N/A";
	};
  
	return (
	  <div className={`h-full w-full rounded-sm  ${variant === "success" ? "bg-green-main text-white" : (variant === "close" ? "bg-yellow-main" : "bg-white") } border border-black shadow-sm flex flex-col items-center justify-center px-1 text-center`}>
			<p className={`text-sm font-antonio uppercase ${variant === "success" ? " text-white" : "text-gray-900" }`}>{label}</p>
			<p className={`text-[15px] font-sans font-bold ${variant === "success" ? " text-white" : "text-black" }`}>{formatValue(value)}</p>
	  </div>
	);
}
  
export default MovieCardBubble;
  