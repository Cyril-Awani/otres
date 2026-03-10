'use client';

import { motion } from 'framer-motion';
import { Product } from '@/lib/data';
import Image from 'next/image';
import { ShoppingCart, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/contexts/cart-context';

interface ProductCardProps {
	product: Product;
	delay?: number;
}

export function ProductCard({ product, delay = 0 }: ProductCardProps) {
	const [flipped, setFlipped] = useState(false);
	const [showTip, setShowTip] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);

	const { addItem } = useCart();

	// Close tooltip or flipped card when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
				setFlipped(false);
				setShowTip(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay }}
			className="w-full"
		>
			<div
				ref={cardRef}
				className="relative w-full aspect-3/4 cursor-pointer perspective"
				onClick={() => setFlipped(!flipped)}
			>
				<motion.div
					animate={{ rotateY: flipped ? 180 : 0 }}
					transition={{ duration: 0.6 }}
					className="relative w-full h-full preserve-3d"
				>
					{/* ================= FRONT ================= */}
					<div className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
						{/* Image Section */}
						<div className="relative flex-1 overflow-hidden">
							<Image
								src={product.image}
								alt={product.name}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
								className="object-cover transition-transform duration-500 hover:scale-110"
							/>

							<div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

							<div className="absolute top-1 left-2 sm:top-2 sm:left-3 bg-white/90 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg font-bold text-sm sm:text-lg z-10">
								₦{product.price.toLocaleString()}
							</div>

							{/* Tooltip Icon */}
							<div
								className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="relative">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setShowTip(!showTip);
										}}
										className="bg-white/90 backdrop-blur p-1.5 sm:p-2 rounded-full shadow-md hover:scale-110 transition"
									>
										<Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
									</button>

									{showTip && (
										<motion.div
											initial={{ opacity: 0, y: 6 }}
											animate={{ opacity: 1, y: 0 }}
											className="absolute right-0 mt-2 w-40 sm:w-48 bg-black text-white text-[10px] sm:text-xs rounded-lg p-2 sm:p-3 shadow-xl"
										>
											{product.description}
										</motion.div>
									)}
								</div>
							</div>
						</div>

						{/* Content */}
						<div className="p-3 sm:p-5 md:p-6 flex flex-col">
							<h3 className="font-bold text-sm sm:text-lg md:text-xl text-gray-800 mb-2">
								{product.name}
							</h3>

							<button
								onClick={(e) => {
									e.stopPropagation();
									try {
										// add to cart
										// eslint-disable-next-line @typescript-eslint/no-use-before-define
										addItem(product, 1);
									} catch {}
								}}
								className="mt-auto w-full flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-xs sm:text-sm md:text-base font-medium shadow-md hover:shadow-lg"
							>
								<ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
								Add to Cart
							</button>
						</div>
					</div>

					{/* ================= BACK ================= */}
					<div className="absolute inset-0 backface-hidden rotate-y-180 bg-purple-700 text-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col justify-center">
						<h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">
							What This Menu Contains
						</h3>

						<ul className="space-y-2 text-xs sm:text-sm">
							{product.contents.map((item, index) => (
								<li key={index} className="flex items-start gap-2">
									<span>•</span>
									<span>{item}</span>
								</li>
							))}
						</ul>

						<p className="mt-6 text-[10px] sm:text-xs opacity-80">
							Tap card to flip back
						</p>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}
