'use client';

export function AboutUs() {
	return (
		<section className="py-16 px-4 max-w-7xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
				<div>
					<h2 className="text-3xl font-bold mb-6">About Otres Fast Food</h2>
					<p className="text-gray-600 mb-4 leading-relaxed">
						At Otres Fast Food, we bring you the authentic taste of African
						cuisine with a modern twist. From our rich, flavorful swallows to
						our party-perfect jollof rice, every dish is prepared with love and
						the finest ingredients.
					</p>
					<p className="text-gray-600 mb-6 leading-relaxed">
						Whether you're craving a heavy meal or a quick bite, we've got
						something for everyone. Come experience the true taste of Africa,
						right in your neighborhood.
					</p>
					<button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200">
						Learn More About Us
					</button>
				</div>
				<div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center text-gray-500">
					About Us Image
				</div>
			</div>
		</section>
	);
}
