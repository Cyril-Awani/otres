'use client';

import { Carousel } from './Carousel';
import { ArrowRight } from 'lucide-react';

interface Category {
	name: string;
	description: string;
	image?: string;
	href: string;
}

interface CategoriesSectionProps {
	categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
	return (
		<section className="pt-8 px-4 max-w-7xl mx-auto overflow-hidden">
			<div className="flex justify-between items-center mb-4">
				<h2 className="inline-flex text-lg md:text-xl font-semibold py-4 px-2 md:px-8 text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-purple-800">
					Our Popular Categories
				</h2>

				<a
					href="/categories"
					className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors duration-200 text-sm sm:text-base group"
				>
					View All
					<ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
				</a>
			</div>

			<Carousel categories={categories} />
		</section>
	);
}
