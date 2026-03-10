'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
	category: {
		name: string;
		description: string;
		image?: string;
		href: string; // link to navigate when clicked
	};
	isCenter?: boolean;
}

export function CategoryCard({ category, isCenter = true }: CategoryCardProps) {
	return (
		<Link href={category.href} className="block">
			<motion.div
				className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
					isCenter ? 'shadow-xl' : 'shadow-lg'
				}`}
				whileHover={{ y: -8 }}
				transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
			>
				<div className="h-64 md:h-80 relative overflow-hidden">
					{/* Image */}
					{category.image ? (
						<Image
							src={category.image}
							alt={category.name}
							fill
							className="object-cover group-hover:scale-110 transition-transform duration-500"
						/>
					) : (
						<div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
							{category.name} Image
						</div>
					)}

					{/* Overlay for text */}
					<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

					{/* Text on image */}
					<div className="absolute bottom-4 left-4 right-4 text-white">
						<h3 className="font-bold text-lg sm:text-xl">{category.name}</h3>
						<p className="text-sm sm:text-base mt-1 line-clamp-2">
							{category.description}
						</p>
					</div>
				</div>
			</motion.div>
		</Link>
	);
}
