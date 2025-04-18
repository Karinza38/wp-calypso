import page from '@automattic/calypso-router';
import { Button } from '@automattic/components';
import { SiteExcerptData } from '@automattic/sites';
import { useMergeRefs } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useTranslate } from 'i18n-calypso';
import { useMemo, useRef } from 'react';
import NavigationHeader from 'calypso/components/navigation-header';
import ItemView from 'calypso/layout/hosting-dashboard/item-view';
import { addQueryArgs } from 'calypso/lib/url';
import * as paths from 'calypso/my-sites/domains/paths';
import SiteIcon from 'calypso/sites/components/sites-dataviews/site-icon';
import { useSiteAdminInterfaceData } from 'calypso/state/sites/hooks';
import { QueryParams } from '../dataviews/query-params';
import {
	FEATURE_TO_ROUTE_MAP,
	DOMAIN_OVERVIEW,
	EMAIL_MANAGEMENT,
	FEATURE_TO_ROUTE_MAP_IN_SITE_CONTEXT,
} from './constants';
import type {
	ItemData,
	FeaturePreviewInterface,
} from 'calypso/layout/hosting-dashboard/item-view/types';

import './style.scss';

interface Props {
	selectedDomainPreview: React.ReactNode;
	selectedDomain: string;
	selectedFeature: string;
	siteSlug: string;
	site: SiteExcerptData;
	inSiteContext?: boolean;
	queryParams: QueryParams;
}

export function showDomainManagementPage( route: string ) {
	const currentParams = new URL( window.location.href ).searchParams;
	const newUrl = new URL( route, window.location.origin );

	const supportedParams = [ 'page', 'per-page', 'search', 'status' ];
	supportedParams.forEach( ( param ) => {
		if ( currentParams.has( param ) ) {
			const value = currentParams.get( param );
			if ( value ) {
				newUrl.searchParams.set( param, value );
			}
		}
	} );

	page.show( newUrl.toString().replace( window.location.origin, '' ) );
}

type BtnProps = {
	focusRef: React.RefObject< HTMLButtonElement >;
	itemData: ItemData;
};

// This is the tabbed preview pane that is used for the domain management pages.
// Anything passed as selectedDomainPreview will be rendered in the preview pane.
// The selectedFeature prop is used to determine which tab is selected by default.
const DomainOverviewPane = ( {
	selectedDomainPreview,
	selectedDomain,
	selectedFeature,
	siteSlug,
	site,
	inSiteContext,
	queryParams,
}: Props ) => {
	const itemData: ItemData = {
		title: selectedDomain,
		subtitle: site.name || selectedDomain,
		url: site.URL,
		blogId: site.ID,
		isDotcomSite: site.is_wpcom_atomic || site.is_wpcom_staging_site,
		adminUrl: site.options?.admin_url || `${ site.URL }/wp-admin`,
		withIcon: false,
		hideEnvDataInHeader: true,
	};
	const translate = useTranslate();
	const { adminUrl } = useSiteAdminInterfaceData( itemData.blogId );

	const PreviewPaneHeaderButtons = ( { focusRef }: BtnProps ) => {
		const adminButtonRef = useRef< HTMLButtonElement | null >( null );
		const mergedRef = useMergeRefs( [ adminButtonRef, focusRef ] );
		return (
			<>
				{ ! site.options?.is_domain_only && (
					<Button
						primary
						className="button item-preview__admin-button"
						href={ adminUrl }
						ref={ mergedRef }
					>
						{ translate( 'Manage site' ) }
					</Button>
				) }
			</>
		);
	};

	const features: FeaturePreviewInterface[] = useMemo( () => {
		const siteFeatures = [
			{
				label: __( 'Overview' ),
				enabled: true,
				featureIds: [ DOMAIN_OVERVIEW ],
			},
			{
				label: __( 'Email' ),
				enabled: true,
				featureIds: [ EMAIL_MANAGEMENT ],
			},
		];

		return siteFeatures.map( ( { label, enabled, featureIds } ) => {
			const selected = enabled && featureIds.includes( selectedFeature );
			const defaultFeatureId = featureIds[ 0 ];
			return {
				id: defaultFeatureId,
				tab: {
					label,
					visible: enabled,
					selected,
					onTabClick: () => {
						if ( enabled && ! selected ) {
							const featureMap = inSiteContext
								? FEATURE_TO_ROUTE_MAP_IN_SITE_CONTEXT
								: FEATURE_TO_ROUTE_MAP;

							const featureUrl = featureMap[ defaultFeatureId ]
								.replace( ':domain', selectedDomain )
								.replace( ':site', siteSlug );

							showDomainManagementPage( addQueryArgs( queryParams, featureUrl ) );
						}
					},
				},
				enabled,
				preview: enabled ? selectedDomainPreview : null,
			};
		} );
	}, [
		selectedFeature,
		selectedDomainPreview,
		inSiteContext,
		selectedDomain,
		siteSlug,
		queryParams,
	] );

	const navigationItems = useMemo( () => {
		if ( ! inSiteContext ) {
			return [];
		}

		const items = [
			{
				label: site.name || selectedDomain,
				href: `/overview/${ siteSlug }`,
				icon: <SiteIcon site={ site } viewType="breadcrumb" disableClick />,
			},
			{
				label: selectedDomain,
			},
		];

		if ( selectedFeature === EMAIL_MANAGEMENT ) {
			items[ 1 ].href = paths.domainManagementAllOverview(
				siteSlug,
				selectedDomain,
				undefined,
				inSiteContext
			);

			items.push( {
				label: translate( 'Email' ),
			} );
		}

		return items;
	}, [ inSiteContext, site, selectedDomain, siteSlug, selectedFeature, translate ] );

	return (
		<>
			{ inSiteContext && (
				<div className="domain-overview__breadcrumb">
					<NavigationHeader navigationItems={ navigationItems } />
				</div>
			) }

			<ItemView
				itemData={ itemData }
				closeItemView={ () => {
					inSiteContext
						? page.show( '/sites' )
						: page.show( addQueryArgs( queryParams, paths.domainManagementRoot() ) );
				} }
				features={ features }
				enforceTabsView
				itemViewHeaderExtraProps={ {
					headerButtons: PreviewPaneHeaderButtons,
				} }
				hideHeader={ inSiteContext }
			/>
		</>
	);
};

export default DomainOverviewPane;
