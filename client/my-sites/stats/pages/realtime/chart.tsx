import moment from 'moment';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import AsyncLoad from 'calypso/components/async-load';
import wpcom from 'calypso/lib/wp';
import { getMomentSiteZone } from 'calypso/my-sites/stats/hooks/use-moment-site-zone';
import { getSiteOption } from 'calypso/state/sites/selectors';
import { parseChartData } from 'calypso/state/stats/lists/utils';
import PageLoading from '../shared/page-loading';

type Unit = 'hour' | 'day' | 'week' | 'month' | 'year';

interface QueryStatsVisitsParams {
	unit: Unit;
	date: string;
	quantity: number;
	stat_fields: string;
}

interface chartMinuteDataTypes {
	[ key: string ]: number;
}

function queryStatsVisits( siteId: number, params: QueryStatsVisitsParams ) {
	return wpcom.req.get( `/sites/${ siteId }/stats/visits`, params );
}
// TODO: Change to 60 for production.
const UPDATE_INTERVAL_IN_SECONDS = 5;
const MINUTE_DATA_LENGTH = 30;

const RealtimeChart = ( { siteId }: { siteId: number } ) => {
	const gmtOffset = useSelector( ( state: object ) =>
		getSiteOption( state, siteId, 'gmt_offset' )
	) as number;
	const momentSiteZone = useSelector( ( state: object ) => getMomentSiteZone( state, siteId ) );
	const [ viewsData, setViewsData ] = useState( {} as chartMinuteDataTypes );
	const [ initialViewsCount, setInitialViewsCount ] = useState< number | undefined >( undefined );

	useEffect( () => {
		const intervalId = setInterval( () => {
			// Query the chart data by offset YYYY-MM-DD HH:mm:00.
			const adjustedDatetimeForQuery = moment()
				.utcOffset( gmtOffset )
				.format( 'YYYY-MM-DD HH:mm:00' );
			// Index the chart data by local YYYY-MM-DD HH:mm:00 to compare with local time in X-axis tickFormat.
			const localDatetimeKey = moment().format( 'YYYY-MM-DD HH:mm:00' );

			queryStatsVisits( siteId, {
				unit: 'hour',
				date: adjustedDatetimeForQuery,
				quantity: 1,
				stat_fields: 'views',
			} ).then( ( response: any ) => {
				const result = parseChartData( response );
				const views = result[ 0 ].views || 0;

				if ( initialViewsCount === undefined ) {
					setInitialViewsCount( views );
				}

				setViewsData( ( prevViewsData ) => {
					return {
						...prevViewsData,
						[ localDatetimeKey ]: views,
					};
				} );
			} );
		}, UPDATE_INTERVAL_IN_SECONDS * 1000 );

		return () => clearInterval( intervalId );
	}, [ siteId, gmtOffset, initialViewsCount ] );

	const { chartData, maxViews } = useMemo( () => {
		const allDatetimeKeys = [];
		// Display all the minutes in the last 30 minutes.
		for ( let i = 0; i <= MINUTE_DATA_LENGTH; i++ ) {
			const datetime = moment().subtract( i, 'minute' ).format( 'YYYY-MM-DD HH:mm:00' );
			allDatetimeKeys.unshift( datetime );
		}

		let maxViews = 1;
		const data = allDatetimeKeys.map( ( eachMinute ) => {
			const lastMinute = moment( eachMinute )
				.subtract( 1, 'minute' )
				.format( 'YYYY-MM-DD HH:mm:00' );

			let diffViews: number = 0;

			if ( viewsData[ eachMinute ] === undefined ) {
				// No queried minute data yet.
				diffViews = 0;
			} else if ( viewsData[ lastMinute ] === undefined ) {
				// The first queried minute data.
				diffViews = viewsData[ eachMinute ] - ( initialViewsCount || 0 );
			} else if (
				moment( lastMinute ).format( 'YYYY-MM-DD HH' ) !==
				moment( eachMinute ).format( 'YYYY-MM-DD HH' )
			) {
				// If the previous minute is from a different hour, use the current minute's views.
				diffViews = viewsData[ eachMinute ];
			} else {
				// Calculate the difference between the current minute and the previous minute.
				diffViews = viewsData[ eachMinute ] - viewsData[ lastMinute ];
			}

			if ( diffViews > maxViews ) {
				maxViews = diffViews;
			}

			return {
				date: new Date( eachMinute ),
				value: diffViews,
			};
		} );

		return {
			chartData: data,
			maxViews,
		};
	}, [ JSON.stringify( viewsData ) ] ); // eslint-disable-line react-hooks/exhaustive-deps

	// Format the time in minute difference from now.
	const formatTimeTick = ( value: number ) => {
		const date = new Date( value );
		const datetime = date.getTime();

		const now = new Date();
		const nowDatetime = now.getTime();
		const diffMinutes = Math.floor( ( nowDatetime - datetime ) / 1000 / 60 );

		return `-${ diffMinutes }m`;
	};

	return (
		<div>
			<AsyncLoad
				require="calypso/my-sites/stats/components/line-chart"
				className="stats-realtime-chart"
				height={ 425 }
				placeholder={ PageLoading }
				moment={ momentSiteZone }
				chartData={ [
					{
						label: 'Views',
						data: chartData,
					},
				] }
				maxViews={ maxViews }
				formatTimeTick={ formatTimeTick }
			/>
		</div>
	);
};

export default RealtimeChart;
