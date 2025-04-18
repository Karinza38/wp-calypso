/**
 * @jest-environment jsdom
 */
import { ONBOARDING_FLOW } from '@automattic/onboarding';
import { addQueryArgs } from '@wordpress/url';
import onboarding from '../flows/onboarding/onboarding';
import { STEPS } from '../internals/steps';
import { renderFlow } from './helpers';

const originalLocation = window.location;

jest.mock( '../../hooks/use-marketplace-theme-products', () => ( {
	useMarketplaceThemeProducts: () => ( {
		isLoading: false,
		selectedMarketplaceProduct: '',
		selectedMarketplaceProductCartItems: [],
		isMarketplaceThemeSubscriptionNeeded: false,
		isMarketplaceThemeSubscribed: false,
		isExternallyManagedThemeAvailable: false,
	} ),
} ) );

describe( 'Onboarding Flow', () => {
	beforeAll( () => {
		Object.defineProperty( window, 'location', {
			value: {
				assign: jest.fn(),
				replace: jest.fn(),
				pathname: '/setup/onboarding',
				search: '',
				href: 'http://wordpress.com/setup/onboarding',
			},
			writable: true,
		} );
	} );

	afterAll( () => {
		Object.defineProperty( window, 'location', originalLocation );
	} );

	beforeEach( () => {
		jest.resetAllMocks();
	} );

	describe( 'Flow configuration', () => {
		it( 'should be configured as a signup flow', () => {
			expect( onboarding.name ).toBe( ONBOARDING_FLOW );
			expect( onboarding.isSignupFlow ).toBe( true );
		} );
	} );

	describe( 'Processing step navigation', () => {
		it( 'should redirect to home when hasPluginByGoal true and hasExternalTheme false', async () => {
			const { runUseStepNavigationSubmit } = renderFlow( onboarding );

			runUseStepNavigationSubmit( {
				currentStep: STEPS.PROCESSING.slug,
				dependencies: {
					hasExternalTheme: false,
					hasPluginByGoal: true,
					siteSlug: 'test-site.wordpress.com',
				},
			} );

			expect( window.location.replace ).toHaveBeenCalledWith( '/home/test-site.wordpress.com' );
		} );

		it( 'should redirect to home when hasExternalTheme true', async () => {
			const { runUseStepNavigationSubmit } = renderFlow( onboarding );

			runUseStepNavigationSubmit( {
				currentStep: STEPS.PROCESSING.slug,
				dependencies: {
					hasExternalTheme: true,
					siteSlug: 'test-site.wordpress.com',
				},
			} );

			expect( window.location.replace ).toHaveBeenCalledWith(
				addQueryArgs( '/setup/site-setup', {
					siteSlug: 'test-site.wordpress.com',
				} )
			);
		} );
	} );
} );
