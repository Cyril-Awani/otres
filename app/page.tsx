'use client';

import Hero from '@/components/Hero';
import { CategoriesSection } from '@/components/CategoriesSection';
import { FeaturedDishes } from '@/components/FeaturedDishes';
import { AboutUs } from '@/components/AboutUs';
import { Footer } from '@/components/Footer';

export default function Home() {
	const categories = [
		{
			name: 'Rice & Beans',
			description: 'Explore our delicious rice and beans dishes',
			image: '/images/rice.png', // Add your local image here
			href: '/categories/rice-and-beans',
		},
		{
			name: 'Swallow',
			description: 'Traditional swallows for every meal',
			image: '/images/african-swallow.png', // Add your local image here
			href: '/categories/swallow',
		},
		{
			name: 'Soups',
			description: 'Rich and flavorful African soups',
			image: '/images/nigerian-soup.png', // Add your local image here
			href: '/categories/soups',
		},
		{
			name: 'Proteins',
			description: 'Grilled, fried, or stewed proteins',
			image: '/images/chicken.webp', // Add your local image here
			href: '/categories/proteins',
		},
		{
			name: 'Pastries',
			description: 'Freshly baked goods and snacks',
			image: '/images/pastries.png', // Add your local image here
			href: '/categories/small-chops-sides',
		},
		{
			name: 'Drinks',
			description: 'Refreshing drinks and smoothies',
			image: '/images/drinks.jpg', // Add your local image here
			href: '/categories/drinks',
		},
		{
			name: 'Full Option Meals',
			description: 'Perfectly balanced meals with multiple components',
			image: '/images/combination-meals.jpg', // Add your local image here
			href: '/categories/combo-menu',
		},
	];

	return (
		<main className="min-h-screen">
			<Hero />
			<CategoriesSection categories={categories} />
			<FeaturedDishes />
			<AboutUs />
			<Footer />
		</main>
	);
}
