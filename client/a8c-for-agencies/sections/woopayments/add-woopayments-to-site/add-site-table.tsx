import { filterSortAndPaginate } from '@wordpress/dataviews';
import { useTranslate } from 'i18n-calypso';
import { useCallback, useMemo, useState } from 'react';
import A4ATablePlaceholder from 'calypso/a8c-for-agencies/components/a4a-table-placeholder';
import { initialDataViewsState } from 'calypso/a8c-for-agencies/components/items-dashboard/constants';
import ItemsDataViews from 'calypso/a8c-for-agencies/components/items-dashboard/items-dataviews';
import { DataViewsState } from 'calypso/a8c-for-agencies/components/items-dashboard/items-dataviews/interfaces';
import FormRadio from 'calypso/components/forms/form-radio';
import { useDispatch } from 'calypso/state';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { useFetchAllManagedSites } from '../../migrations/hooks/use-fetch-all-managed-sites';
import { useWooPaymentsContext } from '../context';
import type { Site } from '../../sites/types';

export type WooPaymentsSiteItem = {
	id: number;
	site: string;
	date: string;
	rawSite: Site;
};

const AddWooPaymentsToSiteTable = ( {
	selectedSite,
	setSelectedSite,
}: {
	selectedSite: WooPaymentsSiteItem | null;
	setSelectedSite: ( site: WooPaymentsSiteItem | null ) => void;
} ) => {
	const translate = useTranslate();

	const dispatch = useDispatch();

	const { items, isLoading } = useFetchAllManagedSites();

	const { sitesWithPluginsStates: excludedSites } = useWooPaymentsContext();

	const excludedSitesIds = useMemo(
		() => excludedSites?.map( ( site ) => site.blogId ) || [],
		[ excludedSites ]
	);

	// Filter out sites that are already tagged
	const availableSites = useMemo( () => {
		return items.filter( ( item ) => ! excludedSitesIds.includes( item?.rawSite.blog_id ) );
	}, [ items, excludedSitesIds ] );

	const [ dataViewsState, setDataViewsState ] = useState< DataViewsState >( {
		...initialDataViewsState,
		fields: [ 'site' ],
	} );

	const onSelectSite = useCallback(
		( item: WooPaymentsSiteItem ) => {
			setSelectedSite( item );
			dispatch( recordTracksEvent( 'calypso_a8c_woopayments_add_site_table_select_site_click' ) );
		},
		[ dispatch, setSelectedSite ]
	);

	const fields = useMemo( () => {
		const siteColumn = {
			id: 'site',
			label: translate( 'Site' ),
			getValue: ( { item }: { item: WooPaymentsSiteItem } ) => item.site,
			render: ( { item }: { item: WooPaymentsSiteItem } ) => (
				<div>
					<FormRadio
						htmlFor={ `site-${ item.id }` }
						id={ `site-${ item.id }` }
						checked={ selectedSite?.id === item.id }
						onChange={ () => onSelectSite( item ) }
						label={ item.site }
					/>
				</div>
			),
			enableGlobalSearch: true,
			enableHiding: false,
			enableSorting: false,
		};

		return [ siteColumn ];
	}, [ onSelectSite, selectedSite?.id, translate ] );

	const { data: allSites, paginationInfo } = useMemo( () => {
		return filterSortAndPaginate( availableSites as WooPaymentsSiteItem[], dataViewsState, fields );
	}, [ availableSites, dataViewsState, fields ] );

	return (
		<div className="redesigned-a8c-table show-overflow-overlay search-enabled">
			{ isLoading ? (
				<A4ATablePlaceholder />
			) : (
				<ItemsDataViews
					data={ {
						items: allSites,
						fields,
						getItemId: ( item ) => `${ item.id }`,
						pagination: paginationInfo,
						enableSearch: true,
						actions: [],
						dataViewsState: dataViewsState,
						setDataViewsState: setDataViewsState,
						defaultLayouts: { table: {} },
					} }
				/>
			) }
		</div>
	);
};

export default AddWooPaymentsToSiteTable;
