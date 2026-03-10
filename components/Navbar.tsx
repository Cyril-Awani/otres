'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/cart-context';
import { CartModal } from './CartModal';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
	Search,
	ShoppingCart,
	ChevronDown,
	Menu as MenuIcon,
	X,
	Home,
	Phone,
	ArrowRight,
	Utensils,
	Coffee,
	Droplet,
	Beef,
	Wine,
	Cookie,
	Pizza,
	Grid,
} from 'lucide-react';
import { Pacifico } from 'next/font/google';
import { CATEGORIES } from '@/lib/data';

const pacifico = Pacifico({ subsets: ['latin'], weight: '400' });

// Define proper types for menu items
type MenuItem = {
	name: string;
	icon: React.ReactNode;
} & (
	| {
			href: string;
			subcategories?: never;
	  }
	| {
			href?: never;
			subcategories: { name: string; href: string; icon: React.ReactNode }[];
	  }
);

const Navbar = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [scrolled, setScrolled] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLDivElement>(null);
	const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Handle scroll effect
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Helper function to get icon based on category slug
	function getCategoryIcon(slug: string): React.ReactNode {
		switch (slug) {
			case 'breakfast-menu':
				return <Coffee size={18} />;
			case 'rice-and-beans':
				return <Droplet size={18} />;
			case 'swallow':
				return <Utensils size={18} />;
			case 'soups':
				return <Droplet size={18} />;
			case 'proteins':
				return <Beef size={18} />;
			case 'small-chops-sides':
				return <Cookie size={18} />;
			case 'pasta':
				return <Utensils size={18} />;
			case 'combo-menu':
				return <Wine size={18} />;
			case 'drinks':
				return <Wine size={18} />;
			case 'fast-food':
				return <Pizza size={18} />;
			default:
				return <Utensils size={18} />;
		}
	}

	// Generate menu items dynamically from CATEGORIES
	const menuItems: MenuItem[] = [
		// Main Menu dropdown with all categories and icons + "All" option
		{
			name: 'Menu',
			icon: <Utensils size={18} />,
			subcategories: [
				// Add "All" option at the top
				{
					name: 'All Categories',
					href: '/categories',
					icon: <Grid size={18} />,
				},
				// Then all categories
				...CATEGORIES.map((cat) => ({
					name: cat.name,
					href: `/categories/${cat.slug}`,
					icon: getCategoryIcon(cat.slug),
				})),
			],
		},
		// Proteins as direct link
		{
			name: 'Proteins',
			icon: <Beef size={18} />,
			href: '/categories/proteins',
		},
		// Small Chops as direct link
		{
			name: 'Small Chops',
			icon: <Cookie size={18} />,
			href: '/categories/small-chops-sides',
		},
		// Drinks as direct link
		{
			name: 'Drinks',
			icon: <Wine size={18} />,
			href: '/categories/drinks',
		},
	];

	// Handle click outside for mobile menu
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	// Handle click outside for search
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsSearchOpen(false);
				setSearchQuery('');
			}
		};

		if (isSearchOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isSearchOpen]);

	const handleDropdownEnter = (menuName: string) => {
		if (dropdownTimeoutRef.current) {
			clearTimeout(dropdownTimeoutRef.current);
		}
		setActiveDropdown(menuName);
	};

	const handleDropdownLeave = () => {
		dropdownTimeoutRef.current = setTimeout(() => {
			setActiveDropdown(null);
		}, 150);
	};

	// Updated search handler - navigates to categories page with search query
	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(
				`/categories?search=${encodeURIComponent(searchQuery.trim())}`,
			);
			setIsSearchOpen(false);
			setSearchQuery('');
		}
	};

	const clearSearch = () => {
		setSearchQuery('');
	};

	// Close mobile menu and reset dropdown
	const closeMobileMenu = () => {
		setIsOpen(false);
		setActiveDropdown(null);
	};

	// Handle navigation from subcategories
	const handleSubcategoryClick = (href: string) => {
		router.push(href);
		setIsOpen(false);
		setActiveDropdown(null);
	};

	// Toggle dropdown for mobile
	const toggleDropdown = (menuName: string, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveDropdown(activeDropdown === menuName ? null : menuName);
	};

	// Handle main menu item click for mobile (only toggles dropdown)
	const handleMainMenuClick = (menuName: string, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setActiveDropdown(activeDropdown === menuName ? null : menuName);
	};

	// Type guard to check if item has subcategories
	const hasSubcategories = (
		item: MenuItem,
	): item is MenuItem & {
		subcategories: { name: string; href: string; icon: React.ReactNode }[];
	} => {
		return 'subcategories' in item && item.subcategories !== undefined;
	};

	// Type guard to check if item has href
	const hasHref = (item: MenuItem): item is MenuItem & { href: string } => {
		return 'href' in item && item.href !== undefined;
	};

	// Cart items count (dynamic from cart context)
	const { items } = useCart();
	const cartItemsCount = items.reduce(
		(total, item) => total + item.quantity,
		0,
	);

	return (
		<nav
			className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${
				scrolled ? 'shadow-lg' : 'shadow-md'
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 lg:h-20">
					{/* Logo Section */}
					<div className="shrink-0 flex items-center space-x-3">
						<Link href="/" className="flex items-center space-x-3">
							{/* Logo */}
							<div className="relative w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center">
								<Image
									src="/Otreslogo.jpg"
									alt="Otres Fast Food"
									width={66}
									height={66}
									className="rounded-full object-cover"
								/>
							</div>

							{/* Text */}
							<div className="flex flex-col justify-center">
								<div className="text-xl lg:text-2xl font-bold leading-tight flex flex-wrap">
									<span
										className={`${pacifico.className} bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}
									>
										Otres
									</span>
								</div>
								<span className="text-xs text-gray-500">
									Authentic Nigerian Cuisine
								</span>
							</div>
						</Link>
					</div>

					{/* Desktop Menu - Center */}
					<div className="hidden lg:flex items-center space-x-1">
						{menuItems.map((item) => (
							<div
								key={item.name}
								className="relative"
								onMouseEnter={() => handleDropdownEnter(item.name)}
								onMouseLeave={handleDropdownLeave}
							>
								{/* Desktop: Use Link for items with href, button for items with subcategories */}
								{hasSubcategories(item) ? (
									<button
										onClick={() => handleDropdownEnter(item.name)}
										className={`flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-purple-600 transition-all duration-200 rounded-lg hover:bg-purple-50 ${
											activeDropdown === item.name
												? 'text-purple-600 bg-purple-50'
												: ''
										}`}
									>
										<span className="flex items-center space-x-1">
											{item.icon}
											<span className="hidden xl:inline-flex">{item.name}</span>
										</span>
										<ChevronDown
											size={16}
											className={`transform transition-transform duration-200 ${
												activeDropdown === item.name ? 'rotate-180' : ''
											}`}
										/>
									</button>
								) : (
									hasHref(item) && (
										<Link
											href={item.href}
											className={`flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-purple-600 transition-all duration-200 rounded-lg hover:bg-purple-50 ${
												activeDropdown === item.name
													? 'text-purple-600 bg-purple-50'
													: ''
											}`}
										>
											<span className="flex items-center space-x-1">
												{item.icon}
												<span className="hidden xl:inline-flex">
													{item.name}
												</span>
											</span>
										</Link>
									)
								)}

								{/* Dropdown Menu - with hidden scrollbar */}
								{activeDropdown === item.name && hasSubcategories(item) && (
									<div
										className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
										onMouseEnter={() => handleDropdownEnter(item.name)}
										onMouseLeave={handleDropdownLeave}
									>
										<div
											className="max-h-96 overflow-y-auto scrollbar-hide"
											style={{
												scrollbarWidth: 'none',
												msOverflowStyle: 'none',
											}}
										>
											{item.subcategories.map((sub, index) => (
												<React.Fragment key={sub.name}>
													<Link
														href={sub.href}
														className={`flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200 ${
															index === 0 ? 'border-b border-gray-100 mb-1' : ''
														}`}
													>
														<span className="text-purple-600">{sub.icon}</span>
														<span className={index === 0 ? 'font-medium' : ''}>
															{sub.name}
														</span>
													</Link>
												</React.Fragment>
											))}
										</div>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Right Icons */}
					<div className="flex items-center space-x-2">
						<button
							onClick={() => setIsSearchOpen(true)}
							className="p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
							aria-label="Search"
						>
							<Search size={20} />
						</button>

						<button
							onClick={() => setIsCartOpen(true)}
							className="p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200 relative"
							aria-label="Shopping cart"
						>
							<ShoppingCart size={20} />
							{isMounted && cartItemsCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
									{cartItemsCount}
								</span>
							)}
						</button>

						{/* Mobile menu button */}
						<button
							onClick={() => setIsOpen(true)}
							className="lg:hidden p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
							aria-label="Open menu"
						>
							<MenuIcon size={24} />
						</button>
					</div>
				</div>
			</div>

			{/* Search Overlay */}
			<AnimatePresence>
				{isSearchOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="absolute top-0 left-0 w-full bg-white shadow-lg z-50"
					>
						<div
							ref={searchRef}
							className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
						>
							<form onSubmit={handleSearchSubmit} className="relative">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search for meals, categories..."
									className="w-full pl-12 pr-24 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
									autoFocus
								/>
								<Search
									className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={20}
								/>
								<div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
									{searchQuery && (
										<button
											type="button"
											onClick={clearSearch}
											className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
											aria-label="Clear search"
										>
											<X size={16} />
										</button>
									)}
									<button
										type="submit"
										className="px-4 py-1 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-1"
									>
										<span>Search</span>
										<ArrowRight size={16} />
									</button>
								</div>
							</form>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Mobile Menu Overlay with Framer Motion */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed inset-0 bg-black/10 z-40 lg:hidden backdrop-blur-xs"
							onClick={closeMobileMenu}
						/>

						{/* Mobile Menu Panel */}
						<motion.div
							ref={mobileMenuRef}
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-xl z-50 overflow-y-auto lg:hidden"
							style={{
								scrollbarWidth: 'none',
								msOverflowStyle: 'none',
							}}
						>
							<div className="flex flex-col h-full">
								{/* Mobile Menu Header */}
								<div className="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r from-purple-50 to-pink-50">
									<Link
										href="/"
										className="flex items-center space-x-2"
										onClick={closeMobileMenu}
									>
										<div className="relative w-8 h-8">
											<Image
												src="/Otreslogo.jpg"
												alt="Otres Fast Food"
												width={32}
												height={32}
												className="rounded-full"
											/>
										</div>
										<span className="font-bold text-lg">
											<span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
												Otres
											</span>
										</span>
									</Link>
									<button
										onClick={closeMobileMenu}
										className="p-2 text-gray-600 hover:text-purple-600 hover:bg-white rounded-full transition-all duration-200"
										aria-label="Close menu"
									>
										<X size={20} />
									</button>
								</div>

								{/* Mobile Menu Content */}
								<div
									className="flex-1 overflow-y-auto"
									style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
								>
									{/* Home Link */}
									<Link
										href="/"
										className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200"
										onClick={closeMobileMenu}
									>
										<Home size={20} />
										<span className="font-medium">Home</span>
									</Link>

									{/* Menu Items */}
									<div className="mt-2">
										{menuItems.map((item) => (
											<div key={item.name} className="border-b border-gray-100">
												<div className="flex items-center justify-between px-4 py-3">
													{/* Main menu item */}
													{hasSubcategories(item) ? (
														<button
															onClick={(e) => handleMainMenuClick(item.name, e)}
															className="flex-1 flex items-center space-x-3 text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200 text-left"
														>
															{item.icon}
															<span>{item.name}</span>
														</button>
													) : (
														hasHref(item) && (
															<Link
																href={item.href}
																className="flex-1 flex items-center space-x-3 text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200"
																onClick={closeMobileMenu}
															>
																{item.icon}
																<span>{item.name}</span>
															</Link>
														)
													)}

													{/* Arrow button for dropdown */}
													{hasSubcategories(item) && (
														<button
															onClick={(e) => toggleDropdown(item.name, e)}
															className="p-1 hover:text-purple-600 transition-colors duration-200 ml-2"
															aria-label="Toggle subcategories"
														>
															<ChevronDown
																size={18}
																className={`transform transition-transform duration-200 ${
																	activeDropdown === item.name
																		? 'rotate-180'
																		: ''
																}`}
															/>
														</button>
													)}
												</div>

												{/* Mobile Subcategories */}
												{activeDropdown === item.name &&
													hasSubcategories(item) && (
														<motion.div
															initial={{ height: 0, opacity: 0 }}
															animate={{ height: 'auto', opacity: 1 }}
															exit={{ height: 0, opacity: 0 }}
															transition={{ duration: 0.2 }}
															className="bg-gray-50 overflow-hidden"
														>
															<div className="py-2">
																{item.subcategories.map((sub, index) => (
																	<button
																		key={sub.name}
																		onClick={() =>
																			handleSubcategoryClick(sub.href)
																		}
																		className={`w-full text-left px-8 py-2.5 text-sm text-gray-600 hover:bg-linear-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-600 transition-all duration-200 flex items-center space-x-3 ${
																			index === 0
																				? 'border-b border-gray-200 pb-2 mb-1'
																				: ''
																		}`}
																	>
																		<span className="text-purple-600">
																			{sub.icon}
																		</span>
																		<span
																			className={
																				index === 0 ? 'font-medium' : ''
																			}
																		>
																			{sub.name}
																		</span>
																	</button>
																))}
															</div>
														</motion.div>
													)}
											</div>
										))}
									</div>
									<div className="flex justify-center mt-8 px-4">
										<button
											onClick={() => handleSubcategoryClick('/cart')}
											className="flex items-center justify-between gap-6 border-t border-gray-200 px-6 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-md"
										>
											<span className="flex items-center text-sm font-medium text-gray-700 gap-2">
												<ShoppingCart size={24} /> Selected items in Cart
											</span>

											<span className="bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
												{cartItemsCount}
											</span>
										</button>
									</div>
								</div>

								{/* Mobile Menu Footer */}
								<div className="gap-8 px-4 py-4">
									<Link
										href="/contact"
										className="flex items-center space-x-3 px-4 py-3 mt-4 text-gray-700 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200 border-t border-gray-200"
										onClick={closeMobileMenu}
									>
										<Phone size={20} />
										<span className="font-medium">Contact Us</span>
									</Link>

									<p className="text-xs text-gray-500 text-center">
										© 2024 Otres Fast Food. All rights reserved.
									</p>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* Cart Modal */}
			<CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
		</nav>
	);
};

export default Navbar;
