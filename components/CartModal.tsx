'use client';

import { useCart } from '@/contexts/cart-context';
import {
	X,
	Plus,
	Minus,
	ShoppingCart,
	ChevronLeft,
	Edit2,
	CreditCard,
	Wallet,
	ArrowLeft,
	Trash2,
	Package,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import {
	getWhatsAppLink,
	type PaymentMethod as WhatsAppPaymentMethod,
} from '@/lib/whatsapp-message';

interface CartModalProps {
	isOpen: boolean;
	onClose: () => void;
}

// Company-set values
const COMPANY_SETTINGS = {
	TAX_RATE: 0.075, // 7.5%
	PACKAGING_COST: 500, // Fixed packaging cost in Naira
	DISCOUNT: 0, // Fixed discount if any
};

export function CartModal({ isOpen, onClose }: CartModalProps) {
	const { items, total, removeItem, updateQuantity, clear } = useCart();
	const [note, setNote] = useState('');
	const [isEditingNote, setIsEditingNote] = useState(false);
	const [paymentMethod, setPaymentMethod] =
		useState<WhatsAppPaymentMethod>('cash');
	const [showPaymentOptions, setShowPaymentOptions] = useState(false);
	const [clearAfterCheckout, setClearAfterCheckout] = useState(true);
	const [showClearConfirm, setShowClearConfirm] = useState(false);

	// Ref for modal content
	const modalRef = useRef<HTMLDivElement>(null);

	// Calculate costs based on company settings
	const tax = Math.round(total * COMPANY_SETTINGS.TAX_RATE);
	const packagingCost = COMPANY_SETTINGS.PACKAGING_COST;
	const discount = COMPANY_SETTINGS.DISCOUNT;
	const finalTotal = total + tax + packagingCost - discount;

	// Lock body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			const scrollY = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = '100%';
			document.body.style.overflowY = 'scroll';
		} else {
			const scrollY = document.body.style.top;
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			document.body.style.overflowY = '';

			if (scrollY) {
				window.scrollTo(0, parseInt(scrollY || '0') * -1);
			}
		}

		return () => {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			document.body.style.overflowY = '';
		};
	}, [isOpen]);

	// Handle click outside modal
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose]);

	const handleWhatsAppCheckout = () => {
		const whatsappLink = getWhatsAppLink(
			items,
			finalTotal,
			paymentMethod,
			note,
			packagingCost, // Pass packaging cost to WhatsApp message
		);
		window.open(whatsappLink, '_blank');

		if (clearAfterCheckout) {
			clear();
		}

		onClose();
	};

	const handleClearCart = () => {
		if (items.length > 0) {
			setShowClearConfirm(true);
		}
	};

	const confirmClearCart = () => {
		clear();
		setShowClearConfirm(false);
	};

	const getPaymentMethodDisplay = () => {
		switch (paymentMethod) {
			case 'cash':
				return {
					icon: <Wallet className="w-4 h-4" />,
					text: 'Cash on Delivery',
				};
			case 'transfer':
				return {
					icon: <CreditCard className="w-4 h-4" />,
					text: 'Bank Transfer',
				};
		}
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

			{/* Modal - Phone Checkout Style */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div
					ref={modalRef}
					className="bg-white rounded-3xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden"
				>
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-gray-100">
						<button
							onClick={
								showPaymentOptions
									? () => setShowPaymentOptions(false)
									: onClose
							}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							aria-label={showPaymentOptions ? 'Go back' : 'Close modal'}
						>
							{showPaymentOptions ? (
								<ArrowLeft className="w-5 h-5 text-gray-700" />
							) : (
								<ChevronLeft className="w-5 h-5 text-gray-700" />
							)}
						</button>
						<h2 className="text-lg font-semibold text-gray-900">
							{showPaymentOptions ? 'Payment Method' : 'Checkout'}
						</h2>
						{/* Clear Cart Button - Only show when not in payment options and cart has items */}
						{!showPaymentOptions && items.length > 0 ? (
							<button
								onClick={handleClearCart}
								className="p-2 hover:bg-red-50 rounded-full transition-colors group"
								aria-label="Clear cart"
								title="Clear cart"
							>
								<Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
							</button>
						) : (
							<div className="w-9" /> /* Spacer */
						)}
					</div>

					{/* Clear Cart Confirmation Modal */}
					{showClearConfirm && (
						<div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
							<div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl">
								<div className="flex items-center gap-3 mb-4">
									<h3 className="font-semibold text-gray-900">Clear Cart</h3>
								</div>
								<p className="text-gray-600 text-sm mb-6">
									Are you sure you want to remove all items from your cart? This
									action cannot be undone.
								</p>
								<div className="flex gap-3">
									<button
										onClick={() => setShowClearConfirm(false)}
										className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
									>
										Cancel
									</button>
									<button
										onClick={confirmClearCart}
										className="flex-1 px-4 py-2 bg-red-500 rounded-lg text-sm font-medium text-white hover:bg-red-600 transition-colors"
									>
										Clear
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Scrollable Content */}
					<div className="flex-1 overflow-y-auto px-6 py-4">
						{showPaymentOptions ? (
							/* Payment Options View */
							<div className="space-y-3">
								<button
									onClick={() => {
										setPaymentMethod('cash');
										setShowPaymentOptions(false);
									}}
									className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
										paymentMethod === 'cash'
											? 'border-orange-500 bg-orange-50'
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center ${
											paymentMethod === 'cash' ? 'bg-orange-500' : 'bg-gray-100'
										}`}
									>
										<Wallet
											className={`w-6 h-6 ${
												paymentMethod === 'cash'
													? 'text-white'
													: 'text-gray-600'
											}`}
										/>
									</div>
									<div className="flex-1 text-left">
										<h3 className="font-semibold text-gray-900">
											Cash on Delivery
										</h3>
										<p className="text-sm text-gray-500">
											Pay when you receive your order
										</p>
									</div>
									{paymentMethod === 'cash' && (
										<div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									)}
								</button>

								<button
									onClick={() => {
										setPaymentMethod('transfer');
										setShowPaymentOptions(false);
									}}
									className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
										paymentMethod === 'transfer'
											? 'border-orange-500 bg-orange-50'
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center ${
											paymentMethod === 'transfer'
												? 'bg-orange-500'
												: 'bg-gray-100'
										}`}
									>
										<CreditCard
											className={`w-6 h-6 ${
												paymentMethod === 'transfer'
													? 'text-white'
													: 'text-gray-600'
											}`}
										/>
									</div>
									<div className="flex-1 text-left">
										<h3 className="font-semibold text-gray-900">
											Bank Transfer
										</h3>
										<p className="text-sm text-gray-500">
											Pay instantly via bank transfer
										</p>
									</div>
									{paymentMethod === 'transfer' && (
										<div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
											<svg
												className="w-4 h-4 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
									)}
								</button>
							</div>
						) : /* Main Cart View */
						items.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12">
								<ShoppingCart className="w-12 h-12 text-gray-300 mb-3" />
								<p className="text-gray-500 text-sm">Your cart is empty</p>
							</div>
						) : (
							<div className="space-y-3">
								{/* Cart Items */}
								{items.map((item) => (
									<div
										key={item.id}
										className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0"
									>
										{/* Product Image */}
										<div className="shrink-0">
											<div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
												{item.image ? (
													<img
														src={item.image}
														alt={item.name}
														className="w-full h-full object-cover"
														onError={(e) => {
															e.currentTarget.style.display = 'none';
															e.currentTarget.parentElement?.classList.add(
																'flex',
																'items-center',
																'justify-center',
															);
															const fallback = document.createElement('span');
															fallback.className = 'text-xs text-gray-400';
															fallback.textContent = 'No image';
															e.currentTarget.parentElement?.appendChild(
																fallback,
															);
														}}
													/>
												) : (
													<span className="text-xs text-gray-400">
														No image
													</span>
												)}
											</div>
										</div>

										{/* Item Details */}
										<div className="flex-1 min-w-0">
											<h3 className="font-medium text-gray-900 text-sm leading-tight">
												{item.name}
											</h3>
											<p className="text-xs text-gray-500 mt-1">
												Price: ₦{item.price.toLocaleString()}
											</p>

											{/* Quantity Controls */}
											<div className="flex items-center gap-2 mt-2">
												<button
													onClick={() =>
														updateQuantity(item.id, item.quantity - 1)
													}
													className="p-1 hover:bg-gray-100 rounded transition"
													aria-label="Decrease quantity"
												>
													<Minus className="w-3.5 h-3.5 text-gray-600" />
												</button>
												<span className="w-5 text-center text-xs font-medium text-gray-900">
													{item.quantity}
												</span>
												<button
													onClick={() =>
														updateQuantity(item.id, item.quantity + 1)
													}
													className="p-1 hover:bg-gray-100 rounded transition"
													aria-label="Increase quantity"
												>
													<Plus className="w-3.5 h-3.5 text-gray-600" />
												</button>
											</div>
										</div>

										{/* Price and Remove */}
										<div className="flex flex-col items-end justify-between">
											<button
												onClick={() => removeItem(item.id)}
												className="p-1 hover:bg-gray-100 rounded transition text-gray-400"
												aria-label="Remove item"
											>
												<X className="w-4 h-4" />
											</button>
											<p className="text-sm font-semibold text-gray-900">
												₦{(item.price * item.quantity).toLocaleString()}
											</p>
										</div>
									</div>
								))}

								{/* Note Section */}
								<div className="pt-4 mt-4">
									<div className="flex items-start gap-3">
										<div className="shrink-0">
											<div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
												<Edit2 className="w-5 h-5 text-gray-600" />
											</div>
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between mb-2">
												<h4 className="font-medium text-gray-900 text-sm">
													Note
												</h4>
												{!isEditingNote && (
													<button
														onClick={() => setIsEditingNote(true)}
														className="text-orange-500 text-xs font-medium hover:text-orange-600"
													>
														{note ? 'Edit' : 'Add Note'}
													</button>
												)}
											</div>

											{isEditingNote ? (
												<div className="space-y-2">
													<textarea
														value={note}
														onChange={(e) => setNote(e.target.value)}
														placeholder="Add any special instructions or notes here..."
														className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
														rows={4}
														autoFocus
													/>
													<div className="flex justify-end gap-2">
														<button
															onClick={() => {
																setIsEditingNote(false);
																setNote('');
															}}
															className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900"
														>
															Cancel
														</button>
														<button
															onClick={() => setIsEditingNote(false)}
															className="px-3 py-1 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600"
														>
															Save
														</button>
													</div>
												</div>
											) : (
												<p
													className={`text-sm ${note ? 'text-gray-700' : 'text-gray-400 italic'}`}
												>
													{note || 'No note added'}
												</p>
											)}
										</div>
									</div>
								</div>

								{/* Packaging Cost Display (Non-editable) */}
								{packagingCost > 0 && (
									<div className="pt-2">
										<div className="flex items-start gap-3">
											<div className="shrink-0">
												<div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
													<Package className="w-5 h-5 text-gray-600" />
												</div>
											</div>
											<div className="flex-1">
												<h4 className="font-medium text-gray-900 text-sm mb-1">
													Packaging Fee
												</h4>
												<p className="text-sm text-gray-700">
													₦{packagingCost.toLocaleString()}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													Standard packaging fee applies to all orders
												</p>
											</div>
										</div>
									</div>
								)}

								{/* Payment Method Section */}
								<div className="pt-4">
									<div className="flex items-center justify-between">
										<h4 className="font-medium text-gray-900 text-sm">
											Payment Method
										</h4>
										<button
											onClick={() => setShowPaymentOptions(true)}
											className="text-orange-500 text-xs font-medium hover:text-orange-600"
										>
											Change
										</button>
									</div>
									<div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 rounded-lg">
										{getPaymentMethodDisplay()?.icon}
										<p className="text-sm text-gray-600">
											{getPaymentMethodDisplay()?.text}
										</p>
									</div>
								</div>

								{/* Clear Cart Toggle Section */}
								<div className="pt-4 border-t border-gray-200">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Trash2 className="w-4 h-4 text-gray-500" />
											<span className="text-sm font-medium text-gray-700">
												Clear cart after checkout
											</span>
										</div>
										<button
											onClick={() => setClearAfterCheckout(!clearAfterCheckout)}
											className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
												clearAfterCheckout ? 'bg-orange-500' : 'bg-gray-300'
											}`}
											role="switch"
											aria-checked={clearAfterCheckout}
										>
											<span
												className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
													clearAfterCheckout ? 'translate-x-6' : 'translate-x-1'
												}`}
											/>
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-1 ml-6">
										{clearAfterCheckout
											? 'Cart will be emptied after sending WhatsApp message'
											: 'Items will remain in cart after checkout'}
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Footer - Order Summary */}
					{items.length > 0 && !showPaymentOptions && (
						<div className="border-t border-gray-100 bg-gray-50 p-6">
							<div className="space-y-3 mb-4">
								<div className="flex justify-between items-center">
									<span className="text-gray-600 text-sm">Subtotal</span>
									<span className="font-semibold text-gray-900 text-sm">
										₦{total.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-gray-600 text-sm">Tax (7.5%)</span>
									<span className="font-semibold text-gray-900 text-sm">
										₦{tax.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-gray-600 text-sm">Packaging</span>
									<span className="font-semibold text-gray-900 text-sm">
										₦{packagingCost.toLocaleString()}
									</span>
								</div>
								{discount > 0 && (
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-sm">Discount</span>
										<span className="font-semibold text-green-600 text-sm">
											-₦{discount.toLocaleString()}
										</span>
									</div>
								)}
								<div className="border-t border-gray-200 pt-3 flex justify-between items-center">
									<span className="font-semibold text-gray-900">
										Total Payment
									</span>
									<span className="text-lg font-bold text-gray-900">
										₦{finalTotal.toLocaleString()}
									</span>
								</div>
							</div>

							<button
								className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-full font-semibold text-sm transition-colors"
								onClick={handleWhatsAppCheckout}
							>
								Process to WhatsApp
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
