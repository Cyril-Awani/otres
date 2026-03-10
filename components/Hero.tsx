'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const heroContent = [
	{
		id: 'swallow',
		title: 'Experience Authentic',
		highlightedText: 'Swallow',
		titleEnd: 'Delights',
		subtitle: 'For the Heavy Meal Lovers',
		description:
			'Indulge in our perfectly paired swallow recipes - from fluffy Amala to smooth Eba, served with rich, aromatic soups that warm your soul.',
		buttonText: 'Explore Swallow Menu',
		buttonLink: '/categories/swallow',

		mobileImageSrc: '/images/eba-egusi-semo-wheat.png',
		desktopImageSrc: '/images/eba-egusi-semo-wheat.png',

		imageAlt: 'Delicious swallow meal with soup',
	},
	{
		id: 'breakfast',
		title: 'Start Your Day with',
		highlightedText: 'Breakfast',
		titleEnd: 'That Hits Different',
		subtitle: 'Morning Excellence',
		description:
			'From sizzling akara to fluffy pancakes, our breakfast options are crafted to give you the perfect start to your day.',
		buttonText: 'View Breakfast Menu',
		buttonLink: '/categories/breakfast-menu',

		mobileImageSrc: '/images/pap-akara.png',
		desktopImageSrc: '/images/pap-akara.png',

		imageAlt: 'Delicious breakfast spread',
	},
	{
		id: 'rice',
		title: 'Masterpiece of',
		highlightedText: 'Rice',
		titleEnd: 'Creations',
		subtitle: 'Perfectly Cooked, Perfectly Seasoned',
		description:
			'Dive into our rich selection of rice dishes - from party-perfect Jollof to comforting fried rice, each grain tells a story.',
		buttonText: 'Discover Rice Dishes',
		buttonLink: '/categories/rice-and-beans',

		mobileImageSrc: '/images/desktoprice.jpg',
		desktopImageSrc: '/images/desktoprice.jpg',

		imageAlt: 'Colorful rice dish',
	},
];

const Hero = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % heroContent.length);
		}, 5000);

		return () => clearInterval(timer);
	}, []);

	return (
		<section className="relative h-150 md:h-175 overflow-hidden">
			{/* Background Images */}
			<div className="absolute inset-0">
				{heroContent.map((content, index) => (
					<motion.div
						key={content.id}
						className="absolute inset-0"
						initial={{ opacity: 0 }}
						animate={{ opacity: index === currentIndex ? 1 : 0 }}
						transition={{ duration: 1, ease: 'easeInOut' }}
					>
						{/* Mobile Image */}
						<Image
							src={content.mobileImageSrc}
							alt={content.imageAlt}
							fill
							sizes="(max-width: 768px) 100vw, 100vw"
							className="object-cover block md:hidden"
							priority={index === 0}
							quality={85}
						/>

						{/* Desktop Image */}
						<Image
							src={content.desktopImageSrc}
							alt={content.imageAlt}
							fill
							sizes="100vw"
							className="object-cover hidden md:block"
							priority={index === 0}
							quality={90}
						/>

						{/* Overlay */}
						<div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
					</motion.div>
				))}
			</div>

			{/* Content */}
			<div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.7, ease: 'easeInOut' }}
						className="text-white max-w-2xl"
					>
						<p className="text-purple-300 font-semibold text-lg md:text-xl mb-3 tracking-wide">
							{heroContent[currentIndex].subtitle}
						</p>

						<h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
							{heroContent[currentIndex].title}{' '}
							<span className="text-purple-400">
								{heroContent[currentIndex].highlightedText}
							</span>{' '}
							{heroContent[currentIndex].titleEnd}
						</h1>

						<p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed">
							{heroContent[currentIndex].description}
						</p>

						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link
								href={heroContent[currentIndex].buttonLink}
								className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-colors duration-300 group text-lg shadow-lg shadow-purple-600/30"
							>
								<span>{heroContent[currentIndex].buttonText}</span>
								<ArrowRight
									size={20}
									className="group-hover:translate-x-1 transition-transform"
								/>
							</Link>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			</div>
		</section>
	);
};

export default Hero;
