import { SiteDetails } from '@automattic/data-stores/src/site';
import { Task } from '../../types';

export const defaultSiteDetails: SiteDetails = {
	ID: 211078228,
	title: 'Test Newsletter',
	name: 'testNewsletter',
	description: 'test newsletter',
	URL: 'https://testnewsletter.wordpress.com',
	domain: '',
	locale: '',
	slug: '',
	capabilities: {
		edit_pages: true,
		edit_posts: true,
		edit_others_posts: true,
		edit_others_pages: true,
		delete_posts: true,
		delete_others_posts: true,
		edit_theme_options: true,
		edit_users: true,
		list_users: true,
		manage_categories: true,
		manage_options: true,
		moderate_comments: true,
		activate_wordads: true,
		promote_users: true,
		publish_posts: true,
		upload_files: true,
		delete_users: false,
		remove_users: true,
		own_site: true,
		view_hosting: true,
		view_stats: true,
		activate_plugins: true,
	},
	jetpack: false,
	is_multisite: true,
	site_owner: 69220074,
	lang: 'en',
	icon: {
		img: 'https://testlib0777.files.wordpress.com/2022/10/site-logo.png?w=96',
		ico: 'https://testlib0777.files.wordpress.com/2022/10/site-logo.png?w=96',
		media_id: 5,
	},
	logo: {
		id: '5',
		sizes: [],
		url: 'https://testlib0777.files.wordpress.com/2022/10/site-logo.png',
	},
	visible: true,
	is_private: false,
	is_coming_soon: true,
	single_user_site: true,
	is_vip: false,
	options: {
		timezone: 'America/Los_Angeles',
		gmt_offset: -7,
		blog_public: 0,
		videopress_enabled: false,
		upgraded_filetypes_enabled: false,
		login_url: 'https://testlib0777.wordpress.com/wp-login.php',
		admin_url: 'https://testlib0777.wordpress.com/wp-admin/',
		is_mapped_domain: false,
		is_redirect: false,
		unmapped_url: 'https://testlib0777.wordpress.com',
		featured_images_enabled: true,
		theme_slug: 'pub/lynx',
		header_image: false,
		background_color: false,
		image_default_link_type: 'none',
		image_thumbnail_width: 150,
		image_thumbnail_height: 150,
		image_thumbnail_crop: 0,
		image_medium_width: 300,
		image_medium_height: 300,
		image_large_width: 1024,
		image_large_height: 1024,
		permalink_structure: '/%year%/%monthnum%/%day%/%postname%/',
		post_formats: [],
		default_post_format: '0',
		default_category: 1,
		allowed_file_types: [
			'jpg',
			'jpeg',
			'png',
			'gif',
			'pdf',
			'doc',
			'ppt',
			'odt',
			'pptx',
			'docx',
			'pps',
			'ppsx',
			'xls',
			'xlsx',
			'key',
			'webp',
			'heic',
			'heif',
			'asc',
		],
		show_on_front: 'page',
		default_likes_enabled: true,
		default_sharing_status: true,
		default_comment_status: true,
		default_ping_status: true,
		software_version: '6.0.2',
		created_at: '2022-10-01T17:24:08+00:00',
		updated_at: '2022-10-01T17:24:10+00:00',
		wordads: false,
		publicize_permanently_disabled: false,
		frame_nonce: 'f8e0ef6e72',
		jetpack_frame_nonce: 'f8e0ef6e72',
		page_on_front: 2,
		page_for_posts: 0,
		headstart: false,
		headstart_is_fresh: false,
		ak_vp_bundle_enabled: null,
		advanced_seo_front_page_description: '',
		advanced_seo_title_formats: [],
		verification_services_codes: null,
		podcasting_archive: null,
		is_domain_only: false,
		is_automated_transfer: false,
		is_wpcom_atomic: false,
		is_wpcom_store: false,
		woocommerce_is_active: false,
		editing_toolkit_is_active: true,
		design_type: null,
		site_segment: null,
		import_engine: null,
		is_pending_plan: false,
		is_wpforteams_site: false,
		p2_hub_blog_id: null,
		is_cloud_eligible: false,
		anchor_podcast: false,
		was_created_with_blank_canvas_design: false,
		videopress_storage_used: 0,
		is_difm_lite_in_progress: false,
		site_intent: 'newsletter',
		site_vertical_id: null,
		launchpad_screen: 'full',
		launchpad_checklist_tasks_statuses: {
			links_edited: false,
		},
	},
	plan: {
		product_id: 1,
		product_slug: 'free_plan',
		product_name: 'WordPress.com Free',
		product_name_short: 'Free',
		expired: false,
		billing_period: '',
		user_is_owner: false,
		is_free: true,
		features: {
			active: [ 'akismet', 'free-blog', 'space', 'support' ],
			available: {
				'core/audio': [
					'personal-bundle',
					'value_bundle',
					'business-bundle',
					'ecommerce-bundle',
					'personal-bundle-2y',
					'value_bundle-2y',
					'business-bundle-2y',
					'ecommerce-bundle-2y',
					'personal-bundle-monthly',
					'value_bundle_monthly',
					'business-bundle-monthly',
					'ecommerce-bundle-monthly',
					'pro-plan-monthly',
					'pro-plan-2y',
					'starter-plan',
					'pro-plan',
				],
			},
		},
	},
	products: [],
	launch_status: 'unlaunched',
	is_wpcom_atomic: false,
	user_interactions: [ '2022-10-01' ],
};

export const defaultTask: Task = {
	id: 'foo_task',
	completed: false,
	disabled: true,
	title: 'Foo Task',
};

export function buildSiteDetails( details ) {
	return {
		...defaultSiteDetails,
		...details,
	};
}

export function buildTask( overrides ) {
	return {
		...defaultTask,
		...overrides,
	};
}

export const defaultDomainResponse: any = {
	adminEmail: undefined,
	aftermarketAuction: false,
	aftermarketAuctionEnd: null,
	aftermarketAuctionStart: null,
	authCodeRequired: true,
	autoRenewalDate: '',
	autoRenewing: false,
	beginTransferUntilDate: '',
	blogId: 0,
	bundledPlanSubscriptionId: undefined,
	canManageDnsRecords: false,
	canManageNameServers: false,
	cannotManageDnsRecordsReason: null,
	cannotManageNameServersReason: null,
	cannotUpdateContactInfoReason: null,
	canSetAsPrimary: false,
	canTransferToOtherSite: true,
	canTransferToAnyUser: true,
	canUpdateContactInfo: false,
	connectionMode: '',
	contactInfoDisclosed: false,
	contactInfoDisclosureAvailable: false,
	currentUserCanAddEmail: false,
	currentUserCanCreateSiteFromDomainOnly: false,
	currentUserCanManage: false,
	currentUserCannotAddEmailReason: null,
	currentUserIsOwner: false,
	dnssecRecords: undefined,
	domain: '',
	domainLockingAvailable: false,
	domainRegistrationAgreementUrl: null,
	emailForwardsCount: 0,
	expired: false,
	expiry: null,
	expirySoon: false,
	gdprConsentStatus: null,
	googleAppsSubscription: null,
	hasRegistration: false,
	hasWpcomNameservers: false,
	hasZone: false,
	isAutoRenewing: false,
	isDnssecEnabled: false,
	isDnssecSupported: false,
	isEligibleForInboundTransfer: false,
	isGravatarDomain: false,
	isGravatarRestrictedDomain: false,
	isHundredsYearDomain: false,
	isIcannVerificationSuspended: false,
	isLocked: false,
	isPendingIcannVerification: false,
	isPendingRenewal: false,
	isPendingWhoisUpdate: false,
	isPremium: false,
	isPrimary: false,
	isRedeemable: false,
	isRenewable: false,
	isSubdomain: false,
	isWPCOMDomain: false,
	isWpcomStagingDomain: false,
	lastTransferError: '',
	manualTransferRequired: false,
	mustRemovePrivacyBeforeContactUpdate: false,
	name: '',
	nominetDomainSuspended: false,
	nominetPendingContactVerificationRequest: false,
	owner: '',
	partnerDomain: false,
	pendingRegistration: false,
	pointsToWpcom: false,
	privacyAvailable: false,
	privateDomain: false,
	redeemableUntil: '',
	registrar: '',
	registrationDate: '',
	registryExpiryDate: '',
	renewableUntil: '',
	sslStatus: null,
	subscriptionId: null,
	supportsDomainConnect: false,
	supportsGdprConsentManagement: false,
	supportsTransferApproval: false,
	titanMailSubscription: null,
	transferAwayEligibleAt: null,
	transferEndDate: null,
	transferLockOnWhoisUpdateOptional: false,
	transferStartDate: null,
	transferStatus: null,
	type: 'MAPPED',
};

export function buildDomainResponse( overrides ) {
	return {
		...defaultDomainResponse,
		...overrides,
	};
}

export const MOCK_USE_QUERY_RESULT = {
	data: undefined,
	dataUpdatedAt: 0,
	error: null,
	errorUpdatedAt: 0,
	failureCount: 0,
	isError: false,
	isFetched: false,
	isFetchedAfterMount: false,
	isFetching: false,
	isIdle: false,
	isLoading: false,
	isLoadingError: false,
	isPlaceholderData: false,
	isRefetchError: false,
	isRefetching: false,
	isStale: false,
	isSuccess: true,
	status: 'success',
	refetch: jest.fn(),
	remove: jest.fn(),
};
