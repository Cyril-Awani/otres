'use client';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
	return (
		<footer className="bg-gray-900 text-white py-12 px-4">
			<div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
				{/* Logo & Social Section */}
				<div className="col-span-2 md:col-span-1">
					<h3 className="text-xl font-bold mb-4">
						<span className="text-purple-400">Otres</span> Fast Food
					</h3>
					<p className="text-gray-400 mb-6">
						Bringing you the best of African cuisine since 2020.
					</p>

					{/* Social Media Icons */}
					<div className="flex space-x-4">
						<Link
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors duration-300"
							aria-label="Facebook"
						>
							<Facebook className="w-5 h-5" />
						</Link>
						<Link
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors duration-300"
							aria-label="Twitter"
						>
							<Twitter className="w-5 h-5" />
						</Link>
						<Link
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors duration-300"
							aria-label="Instagram"
						>
							<Instagram className="w-5 h-5" />
						</Link>
						<Link
							href="https://youtube.com"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 transition-colors duration-300"
							aria-label="YouTube"
						>
							<Youtube className="w-5 h-5" />
						</Link>
					</div>
				</div>

				{/* Quick Links */}
				<div>
					<h4 className="font-semibold mb-4">Quick Links</h4>
					<ul className="space-y-2 text-gray-400">
						<li>
							<Link
								href="/about"
								className="hover:text-purple-400 transition-colors"
							>
								About Us
							</Link>
						</li>
						<li>
							<Link
								href="/menu"
								className="hover:text-purple-400 transition-colors"
							>
								Menu
							</Link>
						</li>
						<li>
							<Link
								href="/contact"
								className="hover:text-purple-400 transition-colors"
							>
								Contact
							</Link>
						</li>
						<li>
							<Link
								href="/faqs"
								className="hover:text-purple-400 transition-colors"
							>
								FAQs
							</Link>
						</li>
					</ul>
				</div>

				{/* Categories */}
				<div>
					<h4 className="font-semibold mb-4">Categories</h4>
					<ul className="space-y-2 text-gray-400">
						<li>
							<Link
								href="/categories/rice-dishes"
								className="hover:text-purple-400 transition-colors"
							>
								Rice Dishes
							</Link>
						</li>
						<li>
							<Link
								href="/categories/swallows"
								className="hover:text-purple-400 transition-colors"
							>
								Swallows
							</Link>
						</li>
						<li>
							<Link
								href="/categories/soups"
								className="hover:text-purple-400 transition-colors"
							>
								Soups
							</Link>
						</li>
						<li>
							<Link
								href="/categories/proteins"
								className="hover:text-purple-400 transition-colors"
							>
								Proteins
							</Link>
						</li>
					</ul>
				</div>

				{/* Contact Info */}
				<div>
					<h4 className="font-semibold mb-4">Contact Us</h4>
					<ul className="space-y-2 text-gray-400">
						<li>123 Food Street, Lagos</li>
						<li>+234 800 000 0000</li>
						<li>info@otresfastfood.com</li>
					</ul>
				</div>
			</div>

			{/* Copyright */}
			<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
				<p>
					&copy; 2024 Otres Fast Food. All rights reserved. <br />
					<span>
						Powered by{' '}
						<a
							href="https://wandalab.vercel.app"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:underline"
						>
							WandaLabs
						</a>
					</span>
				</p>
			</div>
		</footer>
	);
}
