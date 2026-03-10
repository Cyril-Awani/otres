'use client';

import { ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/cart-context';
import { PRODUCTS } from '@/lib/data';

// Define which products to feature (you can manually select these)
const FEATURED_COMBO_IDS = ['combo-1', 'combo-3', 'combo-5', 'combo-2'];

export function FeaturedDishes() {
	const { addItem } = useCart();

	const dishes = PRODUCTS.filter(
		(product) =>
			product.category === 'combo-menu' &&
			FEATURED_COMBO_IDS.includes(product.id),
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8 sm:flex-row gap-4 sm:gap-0">
				<h2 className="text-lg sm:text-xl md:text-2xl font-semibold py-3 sm:py-4 px-5 sm:px-6 text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-purple-800">
					Featured Dishes
				</h2>
				<a
					href="/categories/combo-menu"
					className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors duration-200 text-sm sm:text-base group"
				>
					View All
					<ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
				</a>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
				{dishes.map((dish, index) => (
					<div
						key={dish.id}
						className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
					>
						{/* Image Container with Price Badge */}
						<div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
							<Image
								src={dish.image}
								alt={dish.name}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
								className="object-cover group-hover:scale-110 transition-transform duration-500"
								priority={index === 0}
							/>

							{/* Dark Overlay for better text visibility */}
							<div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

							{/* Price Badge - Top Left */}
							<div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-linear-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg font-bold text-sm sm:text-lg md:text-xl z-10">
								₦{dish.price.toLocaleString()}
							</div>
						</div>

						{/* Content Section */}
						<div className="p-3 sm:p-5 md:p-6">
							{/* Dish Name */}
							<h3 className="font-bold text-sm sm:text-lg md:text-xl text-gray-800 mb-1 sm:mb-2">
								{dish.name}
							</h3>

							{/* Description */}
							<p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base line-clamp-2">
								{dish.description}
							</p>

							{/* Action Button */}
							<button
								onClick={() => {
									addItem(dish, 1);
								}}
								className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-xs sm:text-sm md:text-base font-medium shadow-md hover:shadow-lg"
							>
								<ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
								Add to Cart
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
