// app/layout.tsx (or pages/_app.tsx depending on your Next.js version)
import Navbar from '@/components/Navbar';
import './globals.css';
import { CartProvider } from '@/contexts/cart-context';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-purple-50">
				<CartProvider>
					<Navbar />
					<main>{children}</main>
				</CartProvider>
			</body>
		</html>
	);
}
