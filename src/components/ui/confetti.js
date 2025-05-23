"use client";

import { useEffect } from "react";
import JSConfetti from "js-confetti";

export default function Confetti() {
	useEffect(() => {
		const jsConfetti = new JSConfetti();
		jsConfetti.addConfetti({
			// emojis: ["🎉", "✨", "🎥", "🍿"],
			emojiSize: 20,
			confettiNumber: 200,
		});
	}, []);

	return null;
}