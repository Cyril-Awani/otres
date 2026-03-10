'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, Variants } from 'framer-motion';
import { CategoryCard } from './CategoryCard';

interface Category {
	name: string;
	description: string;
	image?: string;
	href: string;
	color?: string;
}

interface CarouselProps {
	categories: Category[];
}

export function Carousel({ categories }: CarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [direction, setDirection] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

	const getVisibleCards = () => {
		const totalCards = categories.length;
		const cards = [];

		for (let i = -1; i <= 1; i++) {
			let index = (currentIndex + i + totalCards) % totalCards;
			cards.push({
				...categories[index],
				position: i,
				index,
			});
		}

		return cards;
	};

	const handleNext = () => {
		setDirection(1);
		setCurrentIndex((prev) => (prev + 1) % categories.length);
	};

	const handlePrev = () => {
		setDirection(-1);
		setCurrentIndex(
			(prev) => (prev - 1 + categories.length) % categories.length,
		);
	};

	const handleDragEnd = (event: any, info: PanInfo) => {
		const swipeThreshold = 50;
		if (Math.abs(info.offset.x) > swipeThreshold) {
			if (info.offset.x > 0) {
				handlePrev();
			} else {
				handleNext();
			}
		}
	};

	// Auto-play functionality
	useEffect(() => {
		if (isAutoPlaying) {
			autoPlayRef.current = setInterval(() => {
				handleNext();
			}, 5000);
		}

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
			}
		};
	}, [isAutoPlaying, currentIndex]);

	// Fixed slide variants with proper Framer Motion types
	const slideVariants: Variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 500 : -500,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
			transition: {
				x: { type: 'tween', ease: 'easeOut', duration: 0.6 },
				opacity: { duration: 0.5 },
			},
		},
		exit: (direction: number) => ({
			x: direction < 0 ? 500 : -500,
			opacity: 0,
			transition: {
				x: { type: 'tween', ease: 'easeIn', duration: 0.5 },
				opacity: { duration: 0.4 },
			},
		}),
	};

	const visibleCards = getVisibleCards();

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsAutoPlaying(false)}
			onMouseLeave={() => setIsAutoPlaying(true)}
		>
			{/* Navigation Buttons */}
			<button
				onClick={handlePrev}
				className="hidden md:inline-flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-purple-600 rounded-full p-2.5 shadow-lg backdrop-blur-sm transition-all duration-200 md:left-4 lg:left-6"
				aria-label="Previous category"
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<button
				onClick={handleNext}
				className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-purple-600 rounded-full p-2.5 shadow-lg backdrop-blur-sm transition-all duration-200 md:right-4 lg:right-6"
				aria-label="Next category"
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>

			{/* Carousel Container */}
			<div className="relative h-64 md:h-112.5 cursor-grab active:cursor-grabbing">
				{/* Mobile View (1 card) */}
				<div className="block md:hidden relative w-full h-full">
					<AnimatePresence initial={false} custom={direction} mode="wait">
						<motion.div
							key={currentIndex}
							custom={direction}
							variants={slideVariants}
							initial="enter"
							animate="center"
							exit="exit"
							drag="x"
							dragConstraints={{ left: 0, right: 0 }}
							dragElastic={0.2}
							onDragEnd={handleDragEnd}
							className="absolute w-full max-w-sm left-1/2 -translate-x-1/2"
						>
							<CategoryCard category={categories[currentIndex]} />
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Desktop View (3 cards) */}
				<div className="hidden md:flex items-center justify-center gap-4 h-full px-8">
					<AnimatePresence mode="popLayout">
						{visibleCards.map((card, idx) => {
							// Calculate scale and opacity based on position
							const isCenter = card.position === 0;
							const isAdjacent = Math.abs(card.position) === 1;

							const scaleValue = isCenter ? 1 : 0.7;
							const opacityValue = isCenter ? 1 : 0.35;
							const yValue = isCenter ? 0 : 25;
							const zValue = isCenter ? 20 : card.position > 0 ? 5 : 1;

							return (
								<motion.div
									key={`${card.index}-${card.position}`}
									layout
									initial={{
										scale: 0.6,
										opacity: 0,
										y: 40,
									}}
									animate={{
										scale: scaleValue,
										opacity: opacityValue,
										y: yValue,
										zIndex: zValue,
									}}
									exit={{
										scale: 0.6,
										opacity: 0,
										y: -40,
									}}
									transition={{
										type: 'spring',
										stiffness: 300,
										damping: 30,
										mass: 0.8,
									}}
									className="w-full max-w-xs shrink-0"
									whileHover={
										isCenter ? { scale: 1.05 } : { scale: scaleValue }
									}
								>
									<CategoryCard category={card} isCenter={isCenter} />
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
			</div>

			{/* Dots Indicator */}
			<div className="hidden justify-center mt-8 gap-2">
				{categories.map((_, index) => (
					<motion.button
						key={index}
						onClick={() => {
							setDirection(index > currentIndex ? 1 : -1);
							setCurrentIndex(index);
						}}
						className={`h-2 rounded-full transition-all ${
							index === currentIndex
								? 'w-8 bg-purple-600'
								: 'w-2 bg-gray-300 hover:bg-purple-400'
						}`}
						whileHover={{ scale: 1.2 }}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
