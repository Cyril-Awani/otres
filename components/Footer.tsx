'use client';

import { CATEGORIES } from '@/lib/data';
import { CategoryHero } from '@/components/category-hero';
import { CategorySection } from '@/components/category-section';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CategoriesContent() {
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const query = searchParams.get('search');
		if (query) {
			setSearchQuery(query);
		}
	}, [searchParams]);

	return (
		<>
			{/* Main Hero Section */}
			<CategoryHero
				title="Explore Our Delicious Categories"
				subtitle="From traditional swallows to premium proteins - discover authentic flavors in every category"
				backgroundImage="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&q=80"
			/>

			{/* Search Input */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
				className="mt-6 w-full flex justify-center px-4"
			>
				<div className="w-full max-w-2xl relative">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search categories or dishes..."
						className="w-full px-4 py-3 bg-white rounded-xl shadow-md border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery('')}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							✕
						</button>
					)}
				</div>
			</motion.div>

			{/* Search Results Summary */}
			{searchQuery && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-sm text-gray-500 mt-2 text-center"
				>
					Search Results for: "{searchQuery}"
				</motion.p>
			)}

			{/* Categories Content */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="container mx-auto px-6 lg:px-8 md:py-10"
			>
				{/* Intro Text */}
				<div className="hidden md:flex mb:4 md:mb-6 px-4">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="relative max-w-5xl mx-auto text-left md:text-center"
					>
						{/* Left Quote */}
						<span className="absolute -left-3 -top-2 text-6xl text-gray-300 opacity-60 font-serif select-none">
							“
						</span>

						<p className="text-sm md:text-xl text-muted-foreground italic leading-relaxed px-4">
							Browse through our carefully curated categories. Each section
							features a selection of our finest dishes, crafted with authentic
							recipes and the freshest ingredients.
						</p>

						{/* Right Quote */}
						<span className="absolute right-2 -bottom-5 text-6xl text-gray-300 opacity-60 font-serif select-none">
							”
						</span>
					</motion.div>
				</div>

				{/* Category Sections - Only ONE instance */}
				<div className="space-y-16">
					{CATEGORIES.map((category, index) => (
						<CategorySection
							key={category.id}
							category={category}
							index={index}
							searchQuery={searchQuery}
						/>
					))}
				</div>
			</motion.div>

			{/* Footer Section with Wandalabs Credit */}
			<motion.section
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.8 }}
				className="relative mt-20 py-20 overflow-hidden bg-[#2b1d14]"
			>
				{/* Decorative Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
					<div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl"></div>
				</div>

				<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="max-w-3xl mx-auto text-center">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-3xl md:text-4xl font-bold text-white mb-6"
						>
							Ready to Explore Our Menu?
						</motion.h2>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="text-lg text-gray-300 mb-8"
						>
							From classic favorites to exciting new dishes, we have something
							for everyone. Start your culinary journey with us today.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="flex flex-wrap gap-4 justify-center"
						>
							<button className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
								View Full Menu
							</button>
							<button className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
								Contact Us
							</button>
						</motion.div>

						{/* Stats */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20"
						>
							<div>
								<div className="text-3xl md:text-4xl font-bold text-white mb-2">
									50+
								</div>
								<div className="text-sm text-gray-400">Dishes</div>
							</div>
							<div>
								<div className="text-3xl md:text-4xl font-bold text-white mb-2">
									15+
								</div>
								<div className="text-sm text-gray-400">Categories</div>
							</div>
							<div className="col-span-2 md:col-span-1">
								<div className="text-3xl md:text-4xl font-bold text-white mb-2">
									24/7
								</div>
								<div className="text-sm text-gray-400">Service</div>
							</div>
						</motion.div>

						{/* Wandalabs Credit */}
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.4 }}
							className="mt-12 pt-8 border-t border-white/20"
						>
							<p className="text-sm text-gray-400">
								Powered by{' '}
								<a
									href="https://wandalab.vercel.app"
									target="_blank"
									rel="noopener noreferrer"
									className="text-amber-400 hover:text-amber-300 transition-colors font-medium hover:underline"
								>
									Wandalabs
								</a>
							</p>
						</motion.div>
					</div>
				</div>
			</motion.section>
		</>
	);
}
