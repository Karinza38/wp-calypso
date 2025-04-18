/**
 * @jest-environment jsdom
 */
import { screen, waitFor } from '@testing-library/react';
import nock from 'nock';
import React from 'react';
import { renderWithProvider } from 'calypso/test-helpers/testing-library';
import CustomerHome from '../main';
import type { SiteDetails } from '@automattic/data-stores';

jest.mock( '@wordpress/api-fetch' );

jest.mock( '../components/home-content', () => () => (
	<div data-testid="home-content">Home Content</div>
) );

jest.mock( 'calypso/landing/stepper/utils/skip-launchpad', () => ( {
	skipLaunchpad: jest.fn(),
} ) );

jest.mock( 'calypso/state/sites/actions', () => ( {
	requestSite: jest.fn().mockReturnValue( () => {} ),
} ) );

jest.mock( 'calypso/components/data/document-head', () => () => null );
jest.mock( 'calypso/lib/analytics/page-view-tracker', () => () => null );

function makeTestSite( site: Partial< SiteDetails > = {} ): SiteDetails {
	return {
		ID: 1,
		title: 'Test Site',
		slug: 'example.com',
		URL: 'https://example.com',
		domain: 'example.com',
		launch_status: 'launched',
		...site,
		options: {
			site_creation_flow: 'onboarding',
			launchpad_screen: false,
			created_at: '2025-02-17T00:00:00+00:00',
			...site.options,
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any; // This partial site object should be good enough for testing purposes
}

describe( 'CustomerHome', () => {
	beforeEach( () => {
		nock.disableNetConnect();
	} );

	afterEach( () => {
		nock.cleanAll();
	} );

	it( 'should show HomeContent for launched site', async () => {
		const testSite = makeTestSite( { launch_status: 'launched' } );

		renderWithProvider( <CustomerHome site={ testSite } /> );

		await waitFor( () => expect( screen.getByTestId( 'home-content' ) ).toBeInTheDocument() );
		expect( screen.queryByTestId( 'launchpad-first' ) ).not.toBeInTheDocument();
	} );

	it( 'should show HomeContent for unlaunched site when launchpad is skipped', async () => {
		const testSite = makeTestSite( {
			launch_status: 'unlaunched',
			options: { launchpad_screen: 'skipped' },
		} );

		renderWithProvider( <CustomerHome site={ testSite } /> );

		await waitFor( () => expect( screen.getByTestId( 'home-content' ) ).toBeInTheDocument() );
		expect( screen.queryByTestId( 'launchpad-first' ) ).not.toBeInTheDocument();
	} );

	it( 'should show HomeContent for unlaunched site with no intent created by onboarding flow, and launchpad is unskipped', async () => {
		const testSite = makeTestSite( {
			launch_status: 'unlaunched',
			options: { launchpad_screen: false, site_intent: '', site_creation_flow: 'onboarding' },
		} );

		renderWithProvider( <CustomerHome site={ testSite } /> );

		await waitFor( () => expect( screen.getByTestId( 'home-content' ) ).toBeInTheDocument() );
		expect( screen.queryByTestId( 'launchpad-first' ) ).not.toBeInTheDocument();
	} );
} );
