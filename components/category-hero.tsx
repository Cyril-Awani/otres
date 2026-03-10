'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CategoryHeroProps {
	title: string;
	subtitle: string;
	backgroundImage: string;
	children?: ReactNode;
}

export function CategoryHero({
	title,
	subtitle,
	backgroundImage,
	children,
}: CategoryHeroProps) {
	return (
		<div className="hidden md:block relative w-full h-48 overflow-hidden rounded-xl">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${backgroundImage})` }}
			>
				{/* Overlay */}
				<div className="absolute inset-0 bg-black/50" />
			</div>

			{/* Content */}
			<div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center text-pretty"
				>
					{title}
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="mt-4 text-lg sm:text-xl text-white/90 text-center text-balance"
				>
					{subtitle}
				</motion.p>
				{children && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="mt-8"
					>
						{children}
					</motion.div>
				)}
			</div>
		</div>
	);
}
