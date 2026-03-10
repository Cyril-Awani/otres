'use client';

import { CATEGORIES, PRODUCTS } from '@/lib/data';
import { CategoryHero } from '@/components/category-hero';
import { ProductCard } from '@/components/product-card';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Pacifico } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Category } from '@/lib/data';

const pacifico = Pacifico({ subsets: ['latin'], weight: '400' });

export default function CategoryDetailPage() {
	const params = useParams();
	const slug = params.slug as string;
	const [randomCategories, setRandomCategories] = useState<Category[]>([]);
	const [isClient, setIsClient] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [isSticky, setIsSticky] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const category = CATEGORIES.find((c) => c.slug === slug);
	const allCategoryProducts = PRODUCTS.filter((p) => p.category === slug);

	// Handle scroll for sticky header
	useEffect(() => {
		const handleScroll = () => {
			const heroSection = document.getElementById('category-hero');
			if (heroSection) {
				const heroBottom = heroSection.getBoundingClientRect().bottom;
				// Make sticky if:
				// 1. We've scrolled past the hero section, OR
				// 2. There's an active search query (to keep search accessible)
				setIsSticky(heroBottom < 0 || searchQuery.length > 0);
			}
		};

		window.addEventListener('scroll', handleScroll);
		// Also trigger on search query changes
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	}, [searchQuery]);

	// Focus search input when sticky header appears due to search
	useEffect(() => {
		if (isSticky && searchQuery.length > 0 && searchInputRef.current) {
			// Optional: auto-focus the search input when sticky appears due to search
			// searchInputRef.current.focus();
		}
	}, [isSticky, searchQuery]);

	// Filter products based on search query
	const filteredProducts = useMemo(() => {
		if (!searchQuery.trim()) {
			return allCategoryProducts;
		}

		const query = searchQuery.toLowerCase().trim();
		return allCategoryProducts.filter(
			(product) =>
				product.name.toLowerCase().includes(query) ||
				product.description.toLowerCase().includes(query) ||
				product.contents?.some((content) =>
					content.toLowerCase().includes(query),
				),
		);
	}, [allCategoryProducts, searchQuery]);

	// Handle client-side only randomization
	useEffect(() => {
		setIsClient(true);
		const otherCategories = CATEGORIES.filter((c) => c.id !== category?.id);
		const shuffled = [...otherCategories].sort(() => 0.5 - Math.random());
		setRandomCategories(shuffled.slice(0, 4));
	}, [category?.id]);

	if (!category) {
		return (
			<main className="container mx-auto px-4 py-16 text-center">
				<h1 className="text-2xl font-bold">Category not found</h1>
				<Link href="/categories">
					<button className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg">
						Back to Categories
					</button>
				</Link>
			</main>
		);
	}

	// Static fallback for server render
	const staticCategories: Category[] = CATEGORIES.filter(
		(c) => c.id !== category.id,
	).slice(0, 4);

	const displayCategories =
		isClient && randomCategories.length > 0
			? randomCategories
			: staticCategories;

	return (
		<main className="w-full">
			{/* Back Button - Non-sticky version (hidden when sticky) */}
			<div
				className={`container mx-auto px-4 sm:px-6 lg:px-8 pt-6 ${isSticky ? 'hidden' : 'block'}`}
			>
				<Link href="/categories">
					<motion.button
						whileHover={{ x: -4 }}
						className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to All Categories
					</motion.button>
				</Link>
			</div>

			{/* Sticky Header */}
			<motion.div
				initial={{ y: -100, opacity: 0 }}
				animate={{
					y: isSticky ? 0 : -100,
					opacity: isSticky ? 1 : 0,
				}}
				transition={{ duration: 0.3 }}
				className={`fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-all duration-300 ${
					isSticky ? 'pointer-events-auto' : 'pointer-events-none'
				}`}
				style={{
					backdropFilter: 'blur(8px)',
					backgroundColor: 'rgba(255, 255, 255, 0.95)',
				}}
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
					<div className="flex items-center justify-between gap-4">
						{/* Left side - Back button and category info */}
						<div className="flex items-center gap-4 flex-1 min-w-0">
							<Link href="/categories">
								<motion.button
									whileHover={{ x: -4 }}
									className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors shrink-0"
								>
									<ArrowLeft className="w-4 h-4" />
									<span className="hidden sm:inline">Back</span>
								</motion.button>
							</Link>

							<div className="flex items-center gap-3 min-w-0">
								<div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
									{filteredProducts.length}
								</div>
								<div className="truncate">
									<h2
										className={`${pacifico.className} text-lg font-bold text-foreground truncate`}
									>
										{category.name}
									</h2>
									<p className="text-xs text-muted-foreground truncate hidden sm:block">
										{filteredProducts.length} option
										{filteredProducts.length !== 1 ? 's' : ''}
										{searchQuery && ` matching "${searchQuery}"`}
									</p>
								</div>
							</div>
						</div>

						{/* Search - takes more space on desktop */}
						<div className="w-full max-w-md lg:max-w-lg">
							<div className="relative">
								<input
									ref={searchInputRef}
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder={`Search ${category.name}...`}
									className="w-full px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
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
						</div>
					</div>
				</div>
			</motion.div>

			{/* Category Hero - Add ID for scroll detection */}
			<div
				id="category-hero"
				className="container mx-auto px-4 sm:px-6 lg:px-8 md:py-4"
			>
				<CategoryHero
					title={category.name}
					subtitle={category.description}
					backgroundImage={category.image}
				/>
			</div>

			{/* Products Grid */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6"
			>
				{/* Header - Hidden when sticky */}
				<div
					className={`mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all duration-300 ${
						isSticky ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'
					}`}
				>
					{/* Left Content */}
					<div className="flex flex-col">
						<motion.h2
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className={`${pacifico.className} text-3xl font-bold text-foreground mb-2`}
						>
							{category.name} Options
						</motion.h2>

						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="text-muted-foreground italic text-gray-500"
						>
							{filteredProducts.length} delicious option
							{filteredProducts.length !== 1 ? 's' : ''} to choose from
							{searchQuery && ` matching "${searchQuery}"`}
						</motion.p>
					</div>

					{/* Search - Hidden when sticky (since it's in the sticky header) */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className="w-full md:w-auto md:max-w-md lg:min-w-87.5 relative hidden md:block"
					>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder={`Search ${category.name}...`}
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
					</motion.div>
				</div>

				{/* Products Grid */}
				{filteredProducts.length > 0 ? (
					<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
						{filteredProducts.map((product, idx) => (
							<ProductCard
								key={product.id}
								product={product}
								delay={idx * 0.05}
							/>
						))}
					</div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-16"
					>
						<p className="text-muted-foreground text-lg">
							No products found matching "{searchQuery}"
						</p>
					</motion.div>
				)}
			</motion.div>

			{/* Related Categories (only show if not searching) */}
			{!searchQuery && (
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className="py-8 mt-4"
				>
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-2xl sm:text-3xl font-bold mb-10">
							Other Categories
						</h2>

						<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{displayCategories.map((cat) => {
								const itemCount = PRODUCTS.filter(
									(p) => p.category === cat.slug,
								).length;

								return (
									<Link
										key={cat.id}
										href={`/categories/${cat.slug}`}
										className="group block"
									>
										<motion.div
											whileHover={{ y: -6 }}
											className="relative h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
										>
											<Image
												src={cat.image}
												alt={cat.name}
												fill
												className="object-cover group-hover:scale-110 transition-transform duration-500"
											/>
											<div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
											<h3 className="absolute top-4 left-4 text-white font-bold text-lg sm:text-xl">
												{cat.name}
											</h3>
											<span className="absolute bottom-4 right-4 text-white text-sm sm:text-base font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg">
												{itemCount} items
											</span>
										</motion.div>
									</Link>
								);
							})}
						</div>
					</div>
				</motion.section>
			)}
		</main>
	);
}
