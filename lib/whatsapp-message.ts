// lib/whatsapp.ts (or wherever this function is)
import { CartItem } from '@/contexts/cart-context';

export type PaymentMethod = 'cash' | 'transfer';

export function getWhatsAppLink(
	items: CartItem[],
	total: number,
	paymentMethod: PaymentMethod,
	note?: string,
	packagingCost?: number, // Add packaging cost parameter
) {
	const lines = items.map(
		(it) =>
			`🍽 ${it.name} x${it.quantity} - ₦${(it.price * it.quantity).toLocaleString()}`,
	);

	lines.push(''); // empty line

	// Calculate breakdown
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const tax = Math.round(subtotal * 0.075); // 7.5% tax
	const packaging = packagingCost || 0;
	const finalTotal = total; // total passed in already includes tax + packaging - discount

	// Add price breakdown
	lines.push('📊 ORDER SUMMARY');
	lines.push(`📦 Subtotal: ₦${subtotal.toLocaleString()}`);
	lines.push(`💰 Tax (7.5%): ₦${tax.toLocaleString()}`);
	lines.push(`📦 Packaging: ₦${packaging.toLocaleString()}`);
	lines.push(''); // empty line
	lines.push(`💵 TOTAL: ₦${finalTotal.toLocaleString()}`);

	// Add payment method
	lines.push(''); // empty line
	lines.push(
		`💳 Payment Method: ${paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}`,
	);

	// Add bank details if payment method is transfer
	if (paymentMethod === 'transfer') {
		lines.push(''); // empty line
		lines.push('🏦 Bank Transfer Details:');
		lines.push('Bank: Your Bank Name'); // Replace with your bank
		lines.push('Account Name: Your Account Name'); // Replace with your account name
		lines.push('Account Number: 1234567890'); // Replace with your account number
		lines.push(`Amount: ₦${finalTotal.toLocaleString()}`);
	}

	// Add note if it exists
	if (note && note.trim()) {
		lines.push(''); // empty line
		lines.push(`📝 Note: ${note.trim()}`);
	}

	const message = encodeURIComponent(lines.join('\n'));

	const phoneNumber = '+2348145983735'; // your WhatsApp number in international format
	const cleanNumber = phoneNumber.replace(/\D/g, ''); // remove + and spaces

	return `https://wa.me/${cleanNumber}?text=${message}`;
}
