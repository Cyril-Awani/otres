'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Category, PRODUCTS } from '@/lib/data';
import { ProductCard } from './product-card';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Pacifico } from 'next/font/google';
import { useState, useEffect, useMemo } from 'react';

interface CategorySectionProps {
	category: Category;
	index: number;
	searchQuery?: string;
}

const pacifico = Pacifico({ subsets: ['latin'], weight: '400' });

export function CategorySection({
	category,
	index,
	searchQuery = '',
}: CategorySectionProps) {
	const [open, setOpen] = useState(index === 0);

	// Filter products based on search query
	const filteredProducts = useMemo(() => {
		const categoryProducts = PRODUCTS.filter(
			(p) => p.category === category.slug,
		);

		if (!searchQuery.trim()) {
			return categoryProducts.slice(0, 4);
		}

		const query = searchQuery.toLowerCase().trim();
		return categoryProducts.filter(
			(product) =>
				product.name.toLowerCase().includes(query) ||
				product.description.toLowerCase().includes(query) ||
				product.contents?.some((content) =>
					content.toLowerCase().includes(query),
				),
		);
	}, [category.slug, searchQuery]);

	// Auto-expand if has matches
	useEffect(() => {
		if (searchQuery && filteredProducts.length > 0) {
			setOpen(true);
		}
	}, [searchQuery, filteredProducts.length]);

	// Don't render if no matches
	if (filteredProducts.length === 0) {
		return null;
	}

	return (
		<motion.section
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className="pt-4 pb-2 border-b"
		>
			{/* Header (Clickable) */}
			<div
				onClick={() => setOpen(!open)}
				className="flex items-center justify-between cursor-pointer group"
			>
				<div className="flex-1">
					<div className="flex items-center gap-3 flex-wrap">
						<h2
							className={`${pacifico.className} text-2xl sm:text-3xl text-foreground`}
						>
							{category.name}
						</h2>
						{searchQuery && (
							<span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
								{filteredProducts.length} match
								{filteredProducts.length !== 1 ? 'es' : ''}
							</span>
						)}
					</div>
					<p className="text-muted-foreground mt-2">{category.description}</p>
				</div>

				<motion.div
					animate={{ rotate: open ? 180 : 0 }}
					transition={{ duration: 0.3 }}
				>
					<ChevronDown className="w-6 h-6 text-primary" />
				</motion.div>
			</div>

			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.4 }}
						className="overflow-hidden mt-8"
					>
						{searchQuery && (
							<motion.p
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-sm text-muted-foreground mb-4"
							>
								Showing {filteredProducts.length} result
								{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
							</motion.p>
						)}

						<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
							{filteredProducts.map((product, idx) => (
								<ProductCard
									key={product.id}
									product={product}
									delay={idx * 0.05}
								/>
							))}
						</div>

						{/* Button aligned right - only show if not searching or if there are more to show */}
						{(!searchQuery || filteredProducts.length >= 4) && (
							<div className="mt-8 flex justify-end">
								<Link href={`/categories/${category.slug}`}>
									<motion.button
										whileHover={{ x: 4 }}
										className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
									>
										View all {category.name}
										<ArrowRight className="w-4 h-4" />
									</motion.button>
								</Link>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.section>
	);
}
