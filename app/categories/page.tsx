import { Suspense } from 'react';
import CategoriesContent from './CategoriesContent';

// Loading component for better UX
function CategoriesLoading() {
	return (
		<div className="w-full min-h-screen flex items-center justify-center">
			<div className="text-center">
				{/* Spinner */}
				<div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-gray-600">Loading delicious categories...</p>
			</div>
		</div>
	);
}

export default function CategoriesPage() {
	return (
		<Suspense fallback={<CategoriesLoading />}>
			<CategoriesContent />
		</Suspense>
	);
}
