const WOOCOMMERCE_PRODUCT_SLUG_MAP = {
	'woocommerce-accommodations-bookings': 'woocommerce-accommodation-bookings',
	'woocommerce-additional-image-variations': 'woocommerce-additional-variation-images',
	'woocommerce-advanced-notifications': 'advanced-notifications',
	'woocommerce-all-products-woo-subscriptions': 'all-products-for-woocommerce-subscriptions',
	'woocommerce-automatewoo': 'automatewoo',
	'woocommerce-automatewoo-birthdays': 'automatewoo-birthdays',
	'woocommerce-automatewoo-refer-a-friend': 'automatewoo-refer-a-friend',
	'woocommerce-back-in-stock-notifications': 'back-in-stock-notifications',
	'woocommerce-bookings': 'woocommerce-bookings',
	'woocommerce-bookings-availability': 'woocommerce-bookings-availability',
	'woocommerce-box-office': 'woocommerce-box-office',
	'woocommerce-brands': 'brands',
	'woocommerce-bulk-stock-management': 'bulk-stock-management',
	'woocommerce-checkout-field-editor': 'woocommerce-checkout-field-editor',
	'woocommerce-composite-products': 'composite-products',
	'woocommerce-conditional-shipping-payments': 'conditional-shipping-and-payments',
	'woocommerce-constellation': 'constellation',
	'woocommerce-coupon-campaigns': 'woocommerce-coupon-campaigns',
	'woocommerce-deposits': 'woocommerce-deposits',
	'woocommerce-distance-rate-shipping': 'woocommerce-distance-rate-shipping',
	'woocommerce-dynamic-pricing': 'dynamic-pricing',
	'woocommerce-eu-vat-number': 'eu-vat-number',
	'woocommerce-flat-rate-box-shipping': 'flat-rate-box-shipping',
	'woocommerce-gift-cards': 'gift-cards',
	'woocommerce-gifting-wc-subscriptions': 'woocommerce-subscriptions-gifting',
	'woocommerce-minmax-quantities': 'minmax-quantities',
	'woocommerce-one-page-checkout': 'woocommerce-one-page-checkout',
	'woocommerce-order-barcodes': 'woocommerce-order-barcodes',
	'woocommerce-per-product-shipping': 'per-product-shipping',
	'woocommerce-points-and-rewards': 'woocommerce-points-and-rewards',
	'woocommerce-pre-orders': 'woocommerce-pre-orders',
	'woocommerce-product-add-ons': 'product-add-ons',
	'woocommerce-product-bundles': 'product-bundles',
	'woocommerce-product-csv-import-suite': 'product-csv-import-suite',
	'woocommerce-product-filters': 'product-filters',
	'woocommerce-product-recommendations': 'product-recommendations',
	'woocommerce-product-vendors': 'product-vendors',
	'woocommerce-purchase-order-gateway': 'woocommerce-gateway-purchase-order',
	'woocommerce-rental-products': 'rental-products',
	'woocommerce-returns-warranty-requests': 'warranty-requests',
	'woocommerce-shipment-tracking': 'shipment-tracking',
	'woocommerce-shipping': 'shipping',
	'woocommerce-shipping-multiple-addresses': 'shipping-multiple-addresses',
	'woocommerce-smart-coupons': 'smart-coupons',
	'woocommerce-subscription-downloads': 'woocommerce-subscription-downloads',
	'woocommerce-subscriptions': 'woocommerce-subscriptions',
	'woocommerce-table-rate-shipping': 'table-rate-shipping',
	'woocommerce-tax': 'tax',
	'woocommerce-variation-swatches-and-photos': 'variation-swatches-and-photos',
	'woocommerce-woopayments': 'woocommerce-payments',
};

export function getWooProductUrl( productSlug: string ) {
	const mappedSlug =
		WOOCOMMERCE_PRODUCT_SLUG_MAP[ productSlug as keyof typeof WOOCOMMERCE_PRODUCT_SLUG_MAP ];

	if ( ! mappedSlug ) {
		return null;
	}

	return `https://woocommerce.com/products/${ mappedSlug }/`;
}
