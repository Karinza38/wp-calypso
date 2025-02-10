import i18n from 'i18n-calypso';
import {
	FEATURE_ABANDONED_CART_RECOVERY,
	FEATURE_ACCEPT_LOCAL_PAYMENTS,
	FEATURE_ADVANCED_SEO_TOOLS,
	FEATURE_ADVERTISE_ON_GOOGLE,
	FEATURE_AD_FREE_EXPERIENCE,
	FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION,
	FEATURE_ALWAYS_ONLINE,
	FEATURE_ASSEMBLED_KITS,
	FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN,
	FEATURE_AUTOMATED_SALES_TAXES,
	FEATURE_BACK_IN_STOCK_NOTIFICATIONS,
	FEATURE_BANDWIDTH,
	FEATURE_BEAUTIFUL_THEMES,
	FEATURE_BULK_DISCOUNTS,
	FEATURE_BURST,
	FEATURE_CDN,
	FEATURE_COMMISSION_FEE_STANDARD_FEATURES,
	FEATURE_COMMISSION_FEE_WOO_FEATURES,
	FEATURE_CONNECT_WITH_FACEBOOK,
	FEATURE_CONTACT_FORM_JP,
	FEATURE_CPUS,
	FEATURE_CUSTOMER_BIRTHDAY_EMAILS,
	FEATURE_CUSTOM_DOMAIN,
	FEATURE_CUSTOM_MARKETING_AUTOMATION,
	FEATURE_CUSTOM_ORDER_EMAILS,
	FEATURE_CUSTOM_PRODUCT_KITS,
	FEATURE_DATACENTRE_FAILOVER,
	FEATURE_DEV_TOOLS,
	FEATURE_DISCOUNTED_SHIPPING,
	FEATURE_DISPLAY_PRODUCTS_BRAND,
	FEATURE_DONATIONS_AND_TIPS_JP,
	FEATURE_DYNAMIC_UPSELLS,
	FEATURE_ES_SEARCH_JP,
	FEATURE_FAST_DNS,
	FEATURE_FREE_SSL_CERTIFICATE,
	FEATURE_GIFT_CARDS,
	FEATURE_GLOBAL_EDGE_CACHING,
	FEATURE_GOOGLE_ANALYTICS_V3,
	FEATURE_GROUP_ALL_FEATURES,
	FEATURE_GROUP_DEVELOPER_TOOLS,
	FEATURE_GROUP_ESSENTIAL_FEATURES,
	FEATURE_GROUP_HIGH_AVAILABILITY,
	FEATURE_GROUP_MARKETING_EMAIL,
	FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS,
	FEATURE_GROUP_PAYMENTS,
	FEATURE_GROUP_PERFORMANCE_BOOSTERS,
	FEATURE_GROUP_PRODUCTS,
	FEATURE_GROUP_SECURITY_AND_SAFETY,
	FEATURE_GROUP_SHIPPING,
	FEATURE_GROUP_STORAGE,
	FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS,
	FEATURE_GROUP_THEMES_AND_CUSTOMIZATION,
	FEATURE_GROUP_YOUR_STORE,
	FEATURE_INTEGRATED_PAYMENTS,
	FEATURE_INTEGRATED_SHIPMENT_TRACKING,
	FEATURE_INTERNATIONAL_PAYMENTS,
	FEATURE_INVENTORY_MGMT,
	FEATURE_ISOLATED_INFRA,
	FEATURE_LIST_PRODUCTS_BY_BRAND,
	FEATURE_LIST_UNLIMITED_PRODUCTS,
	FEATURE_LIVE_SHIPPING_RATES,
	FEATURE_LOYALTY_POINTS_PROGRAMS,
	FEATURE_MARKETING_AUTOMATION,
	FEATURE_MIN_MAX_ORDER_QUANTITY,
	FEATURE_MULTI_SITE,
	FEATURE_NEWSLETTERS_RSS,
	FEATURE_ONE_CLICK_RESTORE_V2,
	FEATURE_PAGES,
	FEATURE_PAID_SUBSCRIBERS_JP,
	FEATURE_PAYMENT_BUTTONS_JP,
	FEATURE_PAYPAL_JP,
	FEATURE_PLUGINS_THEMES,
	FEATURE_PLUGIN_AUTOUPDATE_JP,
	FEATURE_POST_EDITS_HISTORY,
	FEATURE_PREMIUM_CONTENT_JP,
	FEATURE_PREMIUM_STORE_THEMES,
	FEATURE_PREMIUM_THEMES,
	FEATURE_PRINT_SHIPPING_LABELS,
	FEATURE_PRODUCT_ADD_ONS,
	FEATURE_PRODUCT_BUNDLES,
	FEATURE_PRODUCT_RECOMMENDATIONS,
	FEATURE_PROMOTE_ON_TIKTOK,
	FEATURE_REALTIME_BACKUPS_JP,
	FEATURE_RECURRING_PAYMENTS,
	FEATURE_REFERRAL_PROGRAMS,
	FEATURE_SALES_REPORTS,
	FEATURE_SECURITY_BRUTE_FORCE,
	FEATURE_SECURITY_DDOS,
	FEATURE_SECURITY_MALWARE,
	FEATURE_SELL_60_COUNTRIES,
	FEATURE_SEO_JP,
	FEATURE_SHIPPING_INTEGRATIONS,
	FEATURE_SITE_ACTIVITY_LOG_JP,
	FEATURE_SITE_STAGING_SITES,
	FEATURE_SMART_REDIRECTS,
	FEATURE_SPAM_JP,
	FEATURE_STATS_JP,
	FEATURE_STATS_PAID,
	FEATURE_STOCK_NOTIFS,
	FEATURE_STORE_DESIGN,
	FEATURE_STREAMLINED_CHECKOUT,
	FEATURE_STYLE_CUSTOMIZATION,
	FEATURE_SYNC_WITH_PINTEREST,
	FEATURE_UNLIMITED_ADMINS,
	FEATURE_UNLIMITED_PRODUCTS,
	FEATURE_UPTIME_MONITOR_JP,
	FEATURE_USERS,
	FEATURE_WAF_V2,
	FEATURE_WOOCOMMERCE_MOBILE_APP,
	FEATURE_WOOCOMMERCE_STORE,
	FEATURE_WORDADS,
	FEATURE_WORDPRESS_CMS,
	FEATURE_WORDPRESS_MOBILE_APP,
	FEATURE_WP_UPDATES,
	WPCOM_FEATURES_PREMIUM_THEMES_UNLIMITED,
	FEATURE_PRIORITY_24_7_SUPPORT,
	FEATURE_FAST_SUPPORT_FROM_EXPERTS,
	FEATURE_GROUP_ADS,
	FEATURE_GROUP_ANALYTICS,
	FEATURE_GROUP_CUSTOM_PLUGINS,
	FEATURE_GROUP_CUSTOMIZE_STYLE,
	FEATURE_GROUP_DOMAIN,
	FEATURE_GROUP_ENTITIES,
	FEATURE_GROUP_SUPPORT,
	FEATURE_GROUP_THEMES,
	FEATURE_GROUP_WOO,
	FEATURE_THEMES_PREMIUM_AND_STORE,
	FEATURE_UNLIMITED_ENTITIES,
	FEATURE_WOOCOMMERCE_HOSTING,
	WPCOM_FEATURES_PREMIUM_THEMES_LIMITED,
	FEATURE_UPLOAD_PLUGINS,
	FEATURE_CONNECT_ANALYTICS,
	FEATURE_GROUP_DEV_TOOLS,
	FEATURE_UNLTD_SOCIAL_MEDIA_JP,
	FEATURE_BIG_SKY_WEBSITE_BUILDER,
	FEATURE_GROUP_BIG_SKY,
	FEATURE_GROUP_UPLOAD_VIDEOS,
	FEATURE_UPLOAD_VIDEO,
	FEATURE_GROUP_STATS,
	FEATURE_STATS_BASIC_20250206,
	FEATURE_STATS_ADVANCED_20250206,
} from './constants';
import { FeatureGroupMap } from './types';

const isUploadVideosTranslated = () => {
	const isEnglishLocale = i18n.getLocaleSlug()?.startsWith( 'en' );
	const hasUploadVideoTranslation =
		i18n.hasTranslation( 'Upload videos' ) &&
		i18n.hasTranslation(
			'Upload video files like mp4 and display them beautifully in 4K resolution, with picture-in-picture, subtitles, and without intrusive ads.'
		);

	return isEnglishLocale || hasUploadVideoTranslation;
};

const isStatsGroupTranslated = () => {
	const isEnglishLocale = i18n.getLocaleSlug()?.startsWith( 'en' );
	const hasTranslation = i18n.hasTranslation( 'Stats' ) && i18n.hasTranslation( 'Premium stats' );
	return isEnglishLocale || hasTranslation;
};

export const featureGroups: Partial< FeatureGroupMap > = {
	[ FEATURE_GROUP_ALL_FEATURES ]: {
		slug: FEATURE_GROUP_ALL_FEATURES,
		getTitle: () => null, // Intentionally null, as this is a placeholder for all features.
		getFeatures: () => [], // This is a placeholder for now. It will not be processed, but theoretically a reference to all the features.
	},
	[ FEATURE_GROUP_STORAGE ]: {
		slug: FEATURE_GROUP_STORAGE,
		getTitle: () => i18n.translate( 'Storage' ),
		getFeatures: () => [], // Intentionally empty for now. We will include a fixed list of feature slugs in a follow-up.
	},
	[ FEATURE_GROUP_ESSENTIAL_FEATURES ]: {
		slug: FEATURE_GROUP_ESSENTIAL_FEATURES,
		getTitle: () => i18n.translate( 'Essential features' ),
		getFeatures: () => [
			FEATURE_PAGES,
			FEATURE_USERS,
			FEATURE_POST_EDITS_HISTORY,
			FEATURE_ALWAYS_ONLINE,
			FEATURE_CUSTOM_DOMAIN,
			FEATURE_BANDWIDTH,
			FEATURE_STATS_JP,
			FEATURE_FAST_SUPPORT_FROM_EXPERTS,
			FEATURE_PRIORITY_24_7_SUPPORT,
			FEATURE_PLUGINS_THEMES,
			FEATURE_PLUGIN_AUTOUPDATE_JP,
			FEATURE_CONTACT_FORM_JP,
			FEATURE_ES_SEARCH_JP,
			FEATURE_SMART_REDIRECTS,
		],
	},
	[ FEATURE_GROUP_PERFORMANCE_BOOSTERS ]: {
		slug: FEATURE_GROUP_PERFORMANCE_BOOSTERS,
		getTitle: () => i18n.translate( 'Performance boosters' ),
		getFeatures: () => [
			FEATURE_FAST_DNS,
			FEATURE_BURST,
			FEATURE_CPUS,
			FEATURE_GLOBAL_EDGE_CACHING,
			FEATURE_CDN,
		],
	},
	[ FEATURE_GROUP_HIGH_AVAILABILITY ]: {
		slug: FEATURE_GROUP_HIGH_AVAILABILITY,
		getTitle: () => i18n.translate( 'High Availability' ),
		getFeatures: () => [
			FEATURE_DATACENTRE_FAILOVER,
			FEATURE_ONE_CLICK_RESTORE_V2,
			FEATURE_REALTIME_BACKUPS_JP,
			FEATURE_UPTIME_MONITOR_JP,
		],
	},
	[ FEATURE_GROUP_DEVELOPER_TOOLS ]: {
		slug: FEATURE_GROUP_DEVELOPER_TOOLS,
		getTitle: () => i18n.translate( 'Developer tools' ),
		getFeatures: () => [
			FEATURE_DEV_TOOLS,
			FEATURE_SITE_STAGING_SITES,
			FEATURE_MULTI_SITE,
			FEATURE_WP_UPDATES,
		],
	},
	[ FEATURE_GROUP_SECURITY_AND_SAFETY ]: {
		slug: FEATURE_GROUP_SECURITY_AND_SAFETY,
		getTitle: () => i18n.translate( 'Security and safety' ),
		getFeatures: () => [
			FEATURE_SECURITY_BRUTE_FORCE,
			FEATURE_ISOLATED_INFRA,
			FEATURE_SPAM_JP,
			FEATURE_SECURITY_DDOS,
			FEATURE_SECURITY_MALWARE,
			FEATURE_WAF_V2,
			FEATURE_SITE_ACTIVITY_LOG_JP,
		],
	},
	[ FEATURE_GROUP_THEMES_AND_CUSTOMIZATION ]: {
		slug: FEATURE_GROUP_THEMES_AND_CUSTOMIZATION,
		getTitle: () => i18n.translate( 'Design customization' ),
		getFeatures: () => [
			FEATURE_BEAUTIFUL_THEMES,
			FEATURE_STYLE_CUSTOMIZATION,
			FEATURE_PREMIUM_THEMES,
		],
	},

	[ FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS ]: {
		slug: FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS,
		getTitle: () => i18n.translate( 'Commerce solutions' ),
		getFeatures: () => [
			FEATURE_PREMIUM_STORE_THEMES,
			FEATURE_STORE_DESIGN,
			FEATURE_UNLIMITED_PRODUCTS,
			FEATURE_DISPLAY_PRODUCTS_BRAND,
			FEATURE_PRODUCT_ADD_ONS,
			FEATURE_ASSEMBLED_KITS,
			FEATURE_MIN_MAX_ORDER_QUANTITY,
			FEATURE_STOCK_NOTIFS,
			FEATURE_DYNAMIC_UPSELLS,
			FEATURE_CUSTOM_MARKETING_AUTOMATION,
			FEATURE_BULK_DISCOUNTS,
			FEATURE_INVENTORY_MGMT,
			FEATURE_STREAMLINED_CHECKOUT,
			FEATURE_SELL_60_COUNTRIES,
			FEATURE_SHIPPING_INTEGRATIONS,
		],
	},
	[ FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS ]: {
		slug: FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS,
		getTitle: () => i18n.translate( 'Growth and monetization tools' ),
		getFeatures: () => [
			FEATURE_NEWSLETTERS_RSS,
			FEATURE_AD_FREE_EXPERIENCE,
			FEATURE_WORDADS,
			FEATURE_STATS_PAID,
			FEATURE_UNLTD_SOCIAL_MEDIA_JP,
			FEATURE_SEO_JP,
			...( isUploadVideosTranslated() ? [ FEATURE_UPLOAD_VIDEO ] : [] ),
			FEATURE_PREMIUM_CONTENT_JP,
			FEATURE_PAID_SUBSCRIBERS_JP,
			FEATURE_COMMISSION_FEE_STANDARD_FEATURES,
			FEATURE_COMMISSION_FEE_WOO_FEATURES,
			FEATURE_DONATIONS_AND_TIPS_JP,
			FEATURE_PAYMENT_BUTTONS_JP,
			FEATURE_PAYPAL_JP,
		],
	},
	[ FEATURE_GROUP_YOUR_STORE ]: {
		slug: FEATURE_GROUP_YOUR_STORE,
		getTitle: () => i18n.translate( 'Your store' ),
		getFeatures: () => [
			FEATURE_WOOCOMMERCE_STORE,
			FEATURE_WOOCOMMERCE_MOBILE_APP,
			FEATURE_WORDPRESS_CMS,
			FEATURE_WORDPRESS_MOBILE_APP,
			FEATURE_CUSTOM_DOMAIN,
			FEATURE_FREE_SSL_CERTIFICATE,
			FEATURE_AUTOMATED_BACKUPS_SECURITY_SCAN,
			FEATURE_AD_FREE_EXPERIENCE,
			FEATURE_UNLIMITED_ADMINS,
			FEATURE_PRIORITY_24_7_SUPPORT,
			FEATURE_FAST_SUPPORT_FROM_EXPERTS,
			WPCOM_FEATURES_PREMIUM_THEMES_UNLIMITED,
			FEATURE_SALES_REPORTS,
			FEATURE_GOOGLE_ANALYTICS_V3,
		],
	},

	/* START: WooExpress Feature Groups */
	[ FEATURE_GROUP_PRODUCTS ]: {
		slug: FEATURE_GROUP_PRODUCTS,
		getTitle: () => i18n.translate( 'Products' ),
		getFeatures: () => [
			FEATURE_LIST_UNLIMITED_PRODUCTS,
			FEATURE_GIFT_CARDS,
			FEATURE_MIN_MAX_ORDER_QUANTITY,
			FEATURE_PRODUCT_BUNDLES,
			FEATURE_CUSTOM_PRODUCT_KITS,
			FEATURE_LIST_PRODUCTS_BY_BRAND,
			FEATURE_PRODUCT_RECOMMENDATIONS,
			FEATURE_AI_ASSISTED_PRODUCT_DESCRIPTION,
		],
	},
	[ FEATURE_GROUP_PAYMENTS ]: {
		slug: FEATURE_GROUP_PAYMENTS,
		getTitle: () => i18n.translate( 'Payments' ),
		getFeatures: () => [
			FEATURE_INTEGRATED_PAYMENTS,
			FEATURE_INTERNATIONAL_PAYMENTS,
			FEATURE_AUTOMATED_SALES_TAXES,
			FEATURE_ACCEPT_LOCAL_PAYMENTS,
			FEATURE_RECURRING_PAYMENTS,
		],
		getFootnotes: () => ( {
			[ i18n.translate(
				'Available as standard in WooCommerce Payments (restrictions apply). Additional extensions may be required for other payment providers.'
			) ]: [
				FEATURE_INTERNATIONAL_PAYMENTS,
				FEATURE_ACCEPT_LOCAL_PAYMENTS,
				FEATURE_RECURRING_PAYMENTS,
			],
		} ),
	},
	[ FEATURE_GROUP_MARKETING_EMAIL ]: {
		slug: FEATURE_GROUP_MARKETING_EMAIL,
		getTitle: () => i18n.translate( 'Marketing & Email' ),
		getFeatures: () => [
			FEATURE_PROMOTE_ON_TIKTOK,
			FEATURE_SYNC_WITH_PINTEREST,
			FEATURE_CONNECT_WITH_FACEBOOK,
			FEATURE_BACK_IN_STOCK_NOTIFICATIONS,
			FEATURE_MARKETING_AUTOMATION,
			FEATURE_ABANDONED_CART_RECOVERY,
			FEATURE_ADVANCED_SEO_TOOLS,
			FEATURE_ADVERTISE_ON_GOOGLE,
			FEATURE_REFERRAL_PROGRAMS,
			FEATURE_CUSTOMER_BIRTHDAY_EMAILS,
			FEATURE_CUSTOM_ORDER_EMAILS,
			FEATURE_LOYALTY_POINTS_PROGRAMS,
		],
	},
	[ FEATURE_GROUP_SHIPPING ]: {
		slug: FEATURE_GROUP_SHIPPING,
		getTitle: () => i18n.translate( 'Shipping' ),
		getFeatures: () => [
			FEATURE_INTEGRATED_SHIPMENT_TRACKING,
			FEATURE_LIVE_SHIPPING_RATES,
			FEATURE_DISCOUNTED_SHIPPING,
			FEATURE_PRINT_SHIPPING_LABELS,
		],
		getFootnotes: () => ( {
			[ i18n.translate(
				'Only available in the U.S. – an additional extension will be required for other countries.'
			) ]: [ FEATURE_DISCOUNTED_SHIPPING, FEATURE_PRINT_SHIPPING_LABELS ],
		} ),
	},
	[ FEATURE_GROUP_DOMAIN ]: {
		slug: FEATURE_GROUP_DOMAIN,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_CUSTOM_DOMAIN ],
	},
	[ FEATURE_GROUP_SUPPORT ]: {
		slug: FEATURE_GROUP_SUPPORT,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_FAST_SUPPORT_FROM_EXPERTS, FEATURE_PRIORITY_24_7_SUPPORT ],
	},
	[ FEATURE_GROUP_THEMES ]: {
		slug: FEATURE_GROUP_THEMES,
		getTitle: () => null,
		getFeatures: () => [
			FEATURE_BEAUTIFUL_THEMES,
			FEATURE_PREMIUM_THEMES,
			FEATURE_THEMES_PREMIUM_AND_STORE,
			WPCOM_FEATURES_PREMIUM_THEMES_UNLIMITED,
			WPCOM_FEATURES_PREMIUM_THEMES_LIMITED,
		],
	},
	[ FEATURE_GROUP_BIG_SKY ]: {
		slug: FEATURE_GROUP_BIG_SKY,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_BIG_SKY_WEBSITE_BUILDER ],
	},
	[ FEATURE_GROUP_ENTITIES ]: {
		slug: FEATURE_GROUP_ENTITIES,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_UNLIMITED_ENTITIES ],
	},

	[ FEATURE_GROUP_UPLOAD_VIDEOS ]: {
		slug: FEATURE_GROUP_UPLOAD_VIDEOS,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_UPLOAD_VIDEO ],
	},

	[ FEATURE_GROUP_STATS ]: {
		slug: FEATURE_GROUP_STATS,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_STATS_BASIC_20250206, FEATURE_STATS_ADVANCED_20250206 ],
	},

	[ FEATURE_GROUP_ADS ]: {
		slug: FEATURE_GROUP_ADS,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_AD_FREE_EXPERIENCE ],
	},
	[ FEATURE_GROUP_CUSTOMIZE_STYLE ]: {
		slug: FEATURE_GROUP_CUSTOMIZE_STYLE,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_STYLE_CUSTOMIZATION ],
	},
	[ FEATURE_GROUP_ANALYTICS ]: {
		slug: FEATURE_GROUP_ANALYTICS,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_CONNECT_ANALYTICS ],
	},
	[ FEATURE_GROUP_WOO ]: {
		slug: FEATURE_GROUP_WOO,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_WOOCOMMERCE_HOSTING ],
	},
	[ FEATURE_GROUP_CUSTOM_PLUGINS ]: {
		slug: FEATURE_GROUP_CUSTOM_PLUGINS,
		getTitle: () => null,
		getFeatures: () => [ FEATURE_UPLOAD_PLUGINS ],
	},
	[ FEATURE_GROUP_DEV_TOOLS ]: {
		slug: FEATURE_GROUP_DEV_TOOLS,
		getTitle: () => null,
		getFeatures: () => [
			FEATURE_DEV_TOOLS,
			FEATURE_SITE_STAGING_SITES,
			FEATURE_MULTI_SITE,
			FEATURE_WP_UPDATES,
		],
	},
};

export function resolveFeatureGroupsForFeaturesGrid( {
	showSimplifiedFeatures,
}: {
	showSimplifiedFeatures?: boolean;
} = {} ): Partial< FeatureGroupMap > {
	if ( showSimplifiedFeatures ) {
		return {
			[ FEATURE_GROUP_STORAGE ]: featureGroups[ FEATURE_GROUP_STORAGE ],
			[ FEATURE_GROUP_BIG_SKY ]: featureGroups[ FEATURE_GROUP_BIG_SKY ],
			[ FEATURE_GROUP_ENTITIES ]: featureGroups[ FEATURE_GROUP_ENTITIES ],
			[ FEATURE_GROUP_DOMAIN ]: featureGroups[ FEATURE_GROUP_DOMAIN ],
			[ FEATURE_GROUP_ADS ]: featureGroups[ FEATURE_GROUP_ADS ],
			[ FEATURE_GROUP_THEMES ]: featureGroups[ FEATURE_GROUP_THEMES ],
			[ FEATURE_GROUP_SUPPORT ]: featureGroups[ FEATURE_GROUP_SUPPORT ],
			[ FEATURE_GROUP_CUSTOMIZE_STYLE ]: featureGroups[ FEATURE_GROUP_CUSTOMIZE_STYLE ],
			...( isStatsGroupTranslated() && {
				[ FEATURE_GROUP_STATS ]: featureGroups[ FEATURE_GROUP_STATS ],
			} ),
			[ FEATURE_GROUP_ANALYTICS ]: featureGroups[ FEATURE_GROUP_ANALYTICS ],
			...( isUploadVideosTranslated() && {
				[ FEATURE_GROUP_UPLOAD_VIDEOS ]: featureGroups[ FEATURE_GROUP_UPLOAD_VIDEOS ],
			} ),
			[ FEATURE_GROUP_CUSTOM_PLUGINS ]: featureGroups[ FEATURE_GROUP_CUSTOM_PLUGINS ],
			[ FEATURE_GROUP_DEV_TOOLS ]: featureGroups[ FEATURE_GROUP_DEV_TOOLS ],
			[ FEATURE_GROUP_WOO ]: featureGroups[ FEATURE_GROUP_WOO ],
		};
	}

	return {
		[ FEATURE_GROUP_ALL_FEATURES ]: featureGroups[ FEATURE_GROUP_ALL_FEATURES ],
		[ FEATURE_GROUP_STORAGE ]: featureGroups[ FEATURE_GROUP_STORAGE ],
	};
}

export function resolveFeatureGroupsForComparisonGrid(): Partial< FeatureGroupMap > {
	return {
		[ FEATURE_GROUP_ESSENTIAL_FEATURES ]: featureGroups[ FEATURE_GROUP_ESSENTIAL_FEATURES ],
		[ FEATURE_GROUP_PERFORMANCE_BOOSTERS ]: featureGroups[ FEATURE_GROUP_PERFORMANCE_BOOSTERS ],
		[ FEATURE_GROUP_HIGH_AVAILABILITY ]: featureGroups[ FEATURE_GROUP_HIGH_AVAILABILITY ],
		[ FEATURE_GROUP_DEVELOPER_TOOLS ]: featureGroups[ FEATURE_GROUP_DEVELOPER_TOOLS ],
		[ FEATURE_GROUP_SECURITY_AND_SAFETY ]: featureGroups[ FEATURE_GROUP_SECURITY_AND_SAFETY ],
		[ FEATURE_GROUP_THEMES_AND_CUSTOMIZATION ]:
			featureGroups[ FEATURE_GROUP_THEMES_AND_CUSTOMIZATION ],
		[ FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS ]:
			featureGroups[ FEATURE_GROUP_SUPERIOR_COMMERCE_SOLUTIONS ],
		[ FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS ]:
			featureGroups[ FEATURE_GROUP_MARKETING_GROWTH_AND_MONETIZATION_TOOLS ],
		[ FEATURE_GROUP_STORAGE ]: featureGroups[ FEATURE_GROUP_STORAGE ],
	};
}

export function resolveWooExpressFeatureGroupsForComparisonGrid(): Partial< FeatureGroupMap > {
	return {
		[ FEATURE_GROUP_YOUR_STORE ]: featureGroups[ FEATURE_GROUP_YOUR_STORE ],
		[ FEATURE_GROUP_PRODUCTS ]: featureGroups[ FEATURE_GROUP_PRODUCTS ],
		[ FEATURE_GROUP_PAYMENTS ]: featureGroups[ FEATURE_GROUP_PAYMENTS ],
		[ FEATURE_GROUP_MARKETING_EMAIL ]: featureGroups[ FEATURE_GROUP_MARKETING_EMAIL ],
		[ FEATURE_GROUP_SHIPPING ]: featureGroups[ FEATURE_GROUP_SHIPPING ],
	};
}
