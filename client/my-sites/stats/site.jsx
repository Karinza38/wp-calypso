import config from '@automattic/calypso-config';
import page from '@automattic/calypso-router';
import { PAST_SEVEN_DAYS, PAST_THIRTY_DAYS } from '@automattic/components';
import { eye } from '@automattic/components/src/icons';
import { Icon, people, starEmpty, commentContent } from '@wordpress/icons';
import clsx from 'clsx';
import { localize, translate } from 'i18n-calypso';
import { find } from 'lodash';
import moment from 'moment';
import { Component } from 'react';
import { connect } from 'react-redux';
import titlecase from 'to-title-case';
import illustration404 from 'calypso/assets/images/illustrations/illustration-404.svg';
import JetpackBackupCredsBanner from 'calypso/blocks/jetpack-backup-creds-banner';
import StatsNavigation from 'calypso/blocks/stats-navigation';
import { AVAILABLE_PAGE_MODULES, navItems } from 'calypso/blocks/stats-navigation/constants';
import AsyncLoad from 'calypso/components/async-load';
import DocumentHead from 'calypso/components/data/document-head';
import QueryJetpackModules from 'calypso/components/data/query-jetpack-modules';
import QueryKeyringConnections from 'calypso/components/data/query-keyring-connections';
import QuerySiteFeatures from 'calypso/components/data/query-site-features';
import QuerySiteKeyrings from 'calypso/components/data/query-site-keyrings';
import EmptyContent from 'calypso/components/empty-content';
import InlineSupportLink from 'calypso/components/inline-support-link';
import JetpackColophon from 'calypso/components/jetpack-colophon';
import Main from 'calypso/components/main';
import NavigationHeader from 'calypso/components/navigation-header';
import StickyPanel from 'calypso/components/sticky-panel';
import memoizeLast from 'calypso/lib/memoize-last';
import { STATS_FEATURE_DATE_CONTROL_LAST_30_DAYS } from 'calypso/my-sites/stats/constants';
import { getMomentSiteZone } from 'calypso/my-sites/stats/hooks/use-moment-site-zone';
import {
	recordGoogleEvent,
	recordTracksEvent,
	withAnalytics,
} from 'calypso/state/analytics/actions';
import { activateModule } from 'calypso/state/jetpack/modules/actions';
import { canCurrentUser } from 'calypso/state/selectors/can-current-user';
import getCurrentRouteParameterized from 'calypso/state/selectors/get-current-route-parameterized';
import isJetpackModuleActive from 'calypso/state/selectors/is-jetpack-module-active';
import isPrivateSite from 'calypso/state/selectors/is-private-site';
import isAtomicSite from 'calypso/state/selectors/is-site-wpcom-atomic';
import { getJetpackStatsAdminVersion, isJetpackSite } from 'calypso/state/sites/selectors';
import getEnvStatsFeatureSupportChecks from 'calypso/state/sites/selectors/get-env-stats-feature-supports';
import { requestModuleSettings } from 'calypso/state/stats/module-settings/actions';
import { getModuleSettings } from 'calypso/state/stats/module-settings/selectors';
import { getModuleToggles } from 'calypso/state/stats/module-toggles/selectors';
import { getUpsellModalView } from 'calypso/state/stats/paid-stats-upsell/selectors';
import { getSelectedSiteId, getSelectedSiteSlug } from 'calypso/state/ui/selectors';
import StatsModuleAuthors from './features/modules/stats-authors';
import StatsModuleClicks from './features/modules/stats-clicks';
import StatsModuleCountries from './features/modules/stats-countries';
import StatsModuleDevices, {
	StatsModuleUpgradeDevicesOverlay,
} from './features/modules/stats-devices';
import StatsModuleDownloads from './features/modules/stats-downloads';
import StatsModuleEmails from './features/modules/stats-emails';
import StatsModuleReferrers from './features/modules/stats-referrers';
import StatsModuleSearch from './features/modules/stats-search';
import StatsModuleTopPosts from './features/modules/stats-top-posts';
import StatsModuleUTM, { StatsModuleUTMOverlay } from './features/modules/stats-utm';
import StatsModuleVideos from './features/modules/stats-videos';
import StatsFeedbackController from './feedback';
import HighlightsSection from './highlights-section';
import { shouldGateStats } from './hooks/use-should-gate-stats';
import MiniCarousel from './mini-carousel';
import { StatsGlobalValuesContext } from './pages/providers/global-provider';
import PromoCards from './promo-cards';
import StatsCardUpdateJetpackVersion from './stats-card-upsell/stats-card-update-jetpack-version';
import ChartTabs from './stats-chart-tabs';
import DatePicker from './stats-date-picker';
import StatsNotices from './stats-notices';
import PageViewTracker from './stats-page-view-tracker';
import StatsPeriodHeader from './stats-period-header';
import StatsPeriodNavigation from './stats-period-navigation';
import StatsPlanUsage from './stats-plan-usage';
import statsStrings from './stats-strings';
import StatsUpsellModal from './stats-upsell-modal';
import { getPathWithUpdatedQueryString } from './utils';

// Sync hidable modules with StatsNavigation.
const HIDDABLE_MODULES = AVAILABLE_PAGE_MODULES.traffic.map( ( module ) => {
	return module.key;
} );

const memoizedQuery = memoizeLast( ( period, endOf ) => ( {
	period,
	date: endOf,
} ) );

const chartRangeToQuery = memoizeLast( ( chartRange ) => ( {
	period: 'day',
	start_date: chartRange.chartStart,
	date: chartRange.chartEnd,
	summarize: 1,
	max: 10,
} ) );

const CHART_VIEWS = {
	attr: 'views',
	legendOptions: [ 'visitors' ],
	icon: <Icon className="gridicon" icon={ eye } />,
	label: translate( 'Views', { context: 'noun' } ),
};
const CHART_VISITORS = {
	attr: 'visitors',
	icon: <Icon className="gridicon" icon={ people } />,
	label: translate( 'Visitors', { context: 'noun' } ),
};
const CHART_LIKES = {
	attr: 'likes',
	icon: <Icon className="gridicon" icon={ starEmpty } />,
	label: translate( 'Likes', { context: 'noun' } ),
};
const CHART_COMMENTS = {
	attr: 'comments',
	icon: <Icon className="gridicon" icon={ commentContent } />,
	label: translate( 'Comments', { context: 'noun' } ),
};
const CHARTS = [ CHART_VIEWS, CHART_VISITORS, CHART_LIKES, CHART_COMMENTS ];

/**
 * Define chart properties with translatable strings getters
 */
Object.defineProperty( CHART_VIEWS, 'label', {
	get: () => translate( 'Views', { context: 'noun' } ),
} );
Object.defineProperty( CHART_VISITORS, 'label', {
	get: () => translate( 'Visitors', { context: 'noun' } ),
} );
Object.defineProperty( CHART_LIKES, 'label', {
	get: () => translate( 'Likes', { context: 'noun' } ),
} );
Object.defineProperty( CHART_COMMENTS, 'label', {
	get: () => translate( 'Comments', { context: 'noun' } ),
} );

const getActiveTab = ( chartTab ) => find( CHARTS, { attr: chartTab } ) || CHARTS[ 0 ];

class StatsSite extends Component {
	static defaultProps = {
		chartTab: 'views',
	};

	// getDerivedStateFromProps will set the state both on init and tab switch
	state = {
		activeTab: null,
		activeLegend: null,
		customChartQuantity: null,
	};

	static getDerivedStateFromProps( props, state ) {
		// when switching from one tab to another or when initializing the component,
		// reset the active legend charts to the defaults for that tab. The legends
		// can be then toggled on and off by the user in `onLegendClick`.
		const activeTab = getActiveTab( props.chartTab );
		if ( activeTab !== state.activeTab ) {
			return {
				activeTab,
				activeLegend: activeTab.legendOptions || [],
			};
		}
		return null;
	}

	getAvailableLegend() {
		const activeTab = getActiveTab( this.props.chartTab );
		return activeTab.legendOptions || [];
	}

	navigationFromChartBar = ( periodStartDate, period ) => {
		let chartStart = periodStartDate;
		let chartEnd = moment( chartStart )
			.endOf( period === 'week' ? 'isoWeek' : period )
			.format( 'YYYY-MM-DD' );

		// Limit navigation within the currently selected range.
		const currentChartStart = this.props.context.query?.chartStart;
		const currentChartEnd = this.props.context.query?.chartEnd;
		if ( currentChartStart && moment( chartStart ).isBefore( currentChartStart ) ) {
			chartStart = currentChartStart;
		}
		if ( currentChartEnd && moment( chartEnd ).isAfter( currentChartEnd ) ) {
			chartEnd = currentChartEnd;
		}

		// Determine the target period for the navigation.
		const targetPeriod = period === 'day' ? 'hour' : 'day';

		const path = `/stats/${ targetPeriod }/${ this.props.slug }`;
		const url = getPathWithUpdatedQueryString( { chartStart, chartEnd }, path );

		return url;
	};

	barClick = ( isNewDateFilteringEnabled, bar ) => {
		this.props.recordGoogleEvent( 'Stats', 'Clicked Chart Bar' );

		if ( ! isNewDateFilteringEnabled ) {
			page.redirect( getPathWithUpdatedQueryString( { startDate: bar.data.period } ) );
			return;
		}

		const { period: barPeriod } = this.props.period;
		// Stop navigation if the bar period is hour.
		if ( barPeriod === 'hour' ) {
			return;
		}

		// Navigate from the chart bar with period and period start date.
		page( this.navigationFromChartBar( bar.data.period, barPeriod ) );
	};

	onChangeLegend = ( activeLegend ) => this.setState( { activeLegend } );

	switchChart = ( tab ) => {
		if ( ! tab.loading && tab.attr !== this.props.chartTab ) {
			this.props.recordGoogleEvent( 'Stats', 'Clicked ' + titlecase( tab.attr ) + ' Tab' );
			// switch the tab by navigating to route with updated query string
			page.show( getPathWithUpdatedQueryString( { tab: tab.attr } ) );
		}
	};

	isModuleHidden( moduleName ) {
		// Determine which modules are hidden.
		// @TODO: Rearrange the layout of modules to be more flexible with hidden blocks.
		if (
			HIDDABLE_MODULES.includes( moduleName ) &&
			this.props.moduleToggles[ moduleName ] === false
		) {
			return true;
		}
	}

	getValidDateOrNullFromInput( inputDate ) {
		if ( inputDate === undefined ) {
			return null;
		}
		const isValid = moment( inputDate ).isValid();
		return isValid ? inputDate : null;
	}

	// Return a default amount of days to subtracts from the present day depending on the period selected.
	// Used in case no starting date is present in the URL.
	getDefaultDaysForPeriod( period, defaultSevenDaysForPeriodDay = false ) {
		switch ( period ) {
			case 'hour':
				return 1;
			case 'day':
				// TODO: Temporary fix for the new date filtering feature.
				if ( defaultSevenDaysForPeriodDay ) {
					return 7;
				}

				return 30;
			case 'week':
				return 12 * 7; // ~last 3 months
			case 'month':
				return 6 * 30; // ~last 6 months
			case 'year':
				return 5 * 365; // ~last 5 years
			default:
				return 30;
		}
	}

	// Note: This is only used in the empty version of the module.
	// There's a similar function inside stats-module/index.jsx that is used when we have content.
	getStatHref( path, query ) {
		const { period, slug } = this.props;
		const paramsValid = period && path && slug;
		if ( ! paramsValid ) {
			return undefined;
		}

		let url = `/stats/${ period.period }/${ path }/${ slug }`;

		if ( query?.start_date ) {
			url += `?startDate=${ query.start_date }&endDate=${ query.date }`;
		} else {
			url += `?startDate=${ period.endOf.format( 'YYYY-MM-DD' ) }`;
		}

		return url;
	}

	renderStats( isInternal ) {
		const {
			date,
			siteId,
			slug,
			isAtomic,
			isJetpack,
			isSitePrivate,
			isOdysseyStats,
			context,
			moduleSettings,
			supportsPlanUsage,
			supportsEmailStats,
			supportsUTMStatsFeature,
			supportsDevicesStatsFeature,
			isOldJetpack,
			shouldForceDefaultDateRange,
			supportUserFeedback,
			momentSiteZone,
		} = this.props;
		const isNewDateFilteringEnabled = config.isEnabled( 'stats/new-date-filtering' ) || isInternal;
		let defaultPeriod = PAST_SEVEN_DAYS;

		const shouldShowUpsells = isOdysseyStats && ! isAtomic;
		const supportsUTMStats = supportsUTMStatsFeature || isInternal;
		const supportsDevicesStats = supportsDevicesStatsFeature || isInternal;

		// Set the current period based on the module settings.
		// @TODO: Introduce the loading state to avoid flickering due to slow module settings request.
		if ( moduleSettings?.highlights?.period_in_days === 30 ) {
			defaultPeriod = PAST_THIRTY_DAYS;
		}

		const queryDate = date.format( 'YYYY-MM-DD' );
		const { period, endOf } = this.props.period;
		const moduleStrings = statsStrings();

		// Set up a custom range for the chart.
		// Dependant on new date range picker controls.
		let customChartRange = null;

		// Sort out end date for chart.
		const chartEnd = this.getValidDateOrNullFromInput( context.query?.chartEnd );

		if ( chartEnd ) {
			customChartRange = { chartEnd };
		} else {
			customChartRange = { chartEnd: momentSiteZone.format( 'YYYY-MM-DD' ) };
		}

		// Find the quantity of bars for the chart.
		let daysInRange = this.getDefaultDaysForPeriod( period, isNewDateFilteringEnabled );
		const chartStart = this.getValidDateOrNullFromInput( context.query?.chartStart );
		const isSameOrBefore = moment( chartStart ).isSameOrBefore( moment( chartEnd ) );

		if ( chartStart && isSameOrBefore ) {
			// Add one to calculation to include the start date.
			daysInRange = moment( chartEnd ).diff( moment( chartStart ), 'days' ) + 1;
			customChartRange.chartStart = chartStart;
		} else {
			// if start date is missing let the frequency of data take over to avoid showing one bar
			// (e.g. months defaulting to 30 days and showing one point)
			customChartRange.chartStart = momentSiteZone
				.clone()
				.subtract( daysInRange - 1, 'days' )
				.format( 'YYYY-MM-DD' );
		}

		customChartRange.daysInRange = daysInRange;

		// TODO: all the date logic should be done in controllers, otherwise it affects the performance.
		// If it's single day period, redirect to hourly stats.
		if ( period === 'day' && daysInRange === 1 ) {
			page.redirect( `/stats/hour/${ slug }${ window.location.search }` );
			return;
		}

		// Calculate diff between requested start and end in `priod` units.
		// Move end point (most recent) to the end of period to account for partial periods
		// (e.g. requesting period between June 2020 and Feb 2021 would require 2 `yearly` units but would return 1 unit without the shift to the end of period)
		// TODO: We need to align the start day of week from the backend.
		let momentPeriod = period;
		if ( momentPeriod === 'week' ) {
			momentPeriod = 'isoWeek';
		} else if ( momentPeriod === 'hour' ) {
			momentPeriod = 'day';
		}
		const adjustedChartStartDate = moment( customChartRange.chartStart ).startOf( momentPeriod );
		const adjustedChartEndDate = moment( customChartRange.chartEnd ).endOf( momentPeriod );

		let customChartQuantity = Math.ceil(
			adjustedChartEndDate.diff( adjustedChartStartDate, period, true )
		);

		// Force the default date range to be 7 days if the 30-day option is locked.
		if ( shouldForceDefaultDateRange ) {
			// For ChartTabs
			customChartQuantity = 7;

			// For StatsDateControl
			customChartRange.daysInRange = 7;
			customChartRange.chartEnd = momentSiteZone.format( 'YYYY-MM-DD' );
			customChartRange.chartStart = momentSiteZone
				.clone()
				.subtract( 7, 'days' )
				.format( 'YYYY-MM-DD' );
		}

		const query = isNewDateFilteringEnabled
			? chartRangeToQuery( customChartRange )
			: memoizedQuery( period, endOf.format( 'YYYY-MM-DD' ) );

		// For period option links
		const traffic = {
			label: translate( 'Traffic' ),
			path: '/stats',
		};
		const slugPath = slug ? `/${ slug }` : '';
		const pathTemplate = `${ traffic.path }/{{ interval }}${ slugPath }?tab=${
			this.state.activeTab ? this.state.activeTab.attr : 'views'
		}`;

		const wrapperClass = clsx( 'stats-content', {
			'is-period-year': period === 'year',
		} );

		const moduleListClasses = clsx(
			'is-events',
			'stats__module-list',
			'stats__module-list--traffic',
			'stats__module--unified',
			'stats__flexible-grid-container'
		);

		const halfWidthModuleClasses = clsx(
			'stats__flexible-grid-item--half',
			'stats__flexible-grid-item--full--large',
			'stats__flexible-grid-item--full--medium'
		);

		return (
			<div className="stats">
				{ ! isOdysseyStats && (
					<div className="stats-banner-wrapper">
						<JetpackBackupCredsBanner event="stats-backup-credentials" />
					</div>
				) }
				<NavigationHeader
					className="stats__section-header modernized-header"
					title={ translate( 'Jetpack Stats' ) }
					subtitle={ translate(
						"Gain insights into the activity and behavior of your site's visitors. {{learnMoreLink}}Learn more{{/learnMoreLink}}",
						{
							components: {
								learnMoreLink: <InlineSupportLink supportContext="stats" showIcon={ false } />,
							},
						}
					) }
					screenReader={ navItems.traffic?.label }
					navigationItems={ [] }
				></NavigationHeader>
				<StatsNavigation
					selectedItem="traffic"
					interval={ period }
					siteId={ siteId }
					slug={ slug }
				/>
				<StatsNotices
					siteId={ siteId }
					isOdysseyStats={ isOdysseyStats }
					statsPurchaseSuccess={ context.query.statsPurchaseSuccess }
				/>
				{ ! isNewDateFilteringEnabled && (
					// @TODO: remove highlight section completely once flag is released
					<HighlightsSection siteId={ siteId } currentPeriod={ defaultPeriod } />
				) }
				{ isNewDateFilteringEnabled && (
					// moves date range block into new location
					<StickyPanel>
						<StatsPeriodHeader>
							<StatsPeriodNavigation
								date={ date }
								period={ period }
								url={ `/stats/${ period }/${ slug }` }
								queryParams={ context.query }
								pathTemplate={ pathTemplate }
								charts={ CHARTS }
								availableLegend={ this.getAvailableLegend() }
								activeTab={ getActiveTab( this.props.chartTab ) }
								activeLegend={ this.state.activeLegend }
								onChangeLegend={ this.onChangeLegend }
								isNewDateFilteringEnabled // @TODO:remove this prop once we release new date filtering
								isWithNewDateControl
								showArrows
								slug={ slug }
								dateRange={ customChartRange }
							>
								{ ' ' }
								<DatePicker
									period={ period }
									date={ date }
									query={ query }
									statsType="statsTopPosts"
									showQueryDate
									isShort
									dateRange={ customChartRange }
								/>
							</StatsPeriodNavigation>
						</StatsPeriodHeader>
					</StickyPanel>
				) }
				<div id="my-stats-content" className={ wrapperClass }>
					<>
						{ ! isNewDateFilteringEnabled && (
							<StatsPeriodHeader>
								<StatsPeriodNavigation
									date={ date }
									period={ period }
									url={ `/stats/${ period }/${ slug }` }
									queryParams={ context.query }
									pathTemplate={ pathTemplate }
									charts={ CHARTS }
									availableLegend={ this.getAvailableLegend() }
									activeTab={ getActiveTab( this.props.chartTab ) }
									activeLegend={ this.state.activeLegend }
									onChangeLegend={ this.onChangeLegend }
									isWithNewDateControl
									showArrows
									slug={ slug }
									dateRange={ customChartRange }
								>
									{ ' ' }
									<DatePicker
										period={ period }
										date={ date }
										query={ query }
										statsType="statsTopPosts"
										showQueryDate
										isShort
									/>
								</StatsPeriodNavigation>
							</StatsPeriodHeader>
						) }

						{ isNewDateFilteringEnabled && ( //adds a new chart instance for the newdatefiltering project
							<ChartTabs
								slug={ slug }
								period={ this.props.period }
								queryParams={ context.query }
								activeTab={ getActiveTab( this.props.chartTab ) }
								activeLegend={ this.state.activeLegend }
								availableLegend={ this.getAvailableLegend() }
								onChangeLegend={ this.onChangeLegend }
								barClick={ this.barClick.bind( this, isNewDateFilteringEnabled ) }
								className="is-date-filtering-enabled"
								switchTab={ this.switchChart }
								charts={ CHARTS }
								queryDate={ queryDate }
								chartTab={ this.props.chartTab }
								customQuantity={ customChartQuantity }
								customRange={ customChartRange }
								showChartHeader // in the new date filtering enabled experience there is a new chart header to show
								isNewDateFilteringEnabled
							/>
						) }
						{ ! isNewDateFilteringEnabled && ( // legacy/old chart @TODO: remove once NewDateFiltering flag is flipped
							<ChartTabs
								activeTab={ getActiveTab( this.props.chartTab ) }
								activeLegend={ this.state.activeLegend }
								availableLegend={ this.getAvailableLegend() }
								onChangeLegend={ this.onChangeLegend }
								barClick={ this.barClick.bind( this, isNewDateFilteringEnabled ) }
								switchTab={ this.switchChart }
								charts={ CHARTS }
								queryDate={ queryDate }
								period={ this.props.period }
								chartTab={ this.props.chartTab }
								customQuantity={ customChartQuantity }
								customRange={ customChartRange }
							/>
						) }
					</>

					{ ! isOdysseyStats && <MiniCarousel slug={ slug } isSitePrivate={ isSitePrivate } /> }

					<div className={ moduleListClasses }>
						<StatsModuleTopPosts
							moduleStrings={ moduleStrings.posts }
							period={ this.props.period }
							query={ query }
							summaryUrl={ this.getStatHref( 'posts', query ) }
							className={ halfWidthModuleClasses }
						/>
						<StatsModuleReferrers
							moduleStrings={ moduleStrings.referrers }
							period={ this.props.period }
							query={ query }
							summaryUrl={ this.getStatHref( 'referrers', query ) }
							className={ halfWidthModuleClasses }
						/>

						<StatsModuleCountries
							moduleStrings={ moduleStrings.countries }
							period={ this.props.period }
							query={ query }
							summaryUrl={ this.getStatHref( 'countryviews', query ) }
							className={ clsx( 'stats__flexible-grid-item--full' ) }
						/>

						{ /* If UTM if supported display the module or update Jetpack plugin card */ }
						{ supportsUTMStats && ! isOldJetpack && (
							<StatsModuleUTM
								siteId={ siteId }
								period={ this.props.period }
								query={ query }
								summaryUrl={ this.getStatHref( 'utm', query ) }
								summary={ false }
								className={ halfWidthModuleClasses }
							/>
						) }

						{ supportsUTMStats && isOldJetpack && (
							<StatsModuleUTMOverlay
								siteId={ siteId }
								className={ halfWidthModuleClasses }
								overlay={
									<StatsCardUpdateJetpackVersion
										className="stats-module__upsell stats-module__upgrade"
										siteId={ siteId }
										statType="utm"
									/>
								}
							/>
						) }

						<StatsModuleClicks
							moduleStrings={ moduleStrings.clicks }
							period={ this.props.period }
							query={ query }
							summaryUrl={ this.getStatHref( 'clicks', query ) }
							className={ halfWidthModuleClasses }
						/>

						{ ! this.isModuleHidden( 'authors' ) && (
							<StatsModuleAuthors
								moduleStrings={ moduleStrings.authors }
								period={ this.props.period }
								query={ query }
								summaryUrl={ this.getStatHref( 'authors', query ) }
								className={ halfWidthModuleClasses }
							/>
						) }

						{ /* Either stacks with "Authors" or takes full width, depending on UTM and Authors visibility */ }
						{ ! isNewDateFilteringEnabled && supportsEmailStats && (
							<StatsModuleEmails
								period={ this.props.period }
								moduleStrings={ moduleStrings.emails }
								query={ query }
								summaryUrl={ this.getStatHref( 'emails', query ) }
								className={ halfWidthModuleClasses }
							/>
						) }

						<StatsModuleSearch
							moduleStrings={ moduleStrings.search }
							period={ this.props.period }
							query={ query }
							summaryUrl={ this.getStatHref( 'searchterms', query ) }
							className={ halfWidthModuleClasses }
						/>

						{ ! this.isModuleHidden( 'videos' ) && (
							<StatsModuleVideos
								moduleStrings={ moduleStrings.videoplays }
								period={ this.props.period }
								query={ query }
								summaryUrl={ this.getStatHref( 'videoplays', query ) }
								className={ halfWidthModuleClasses }
							/>
						) }

						{
							// File downloads are not yet supported in Jetpack environment
							! isJetpack && (
								<StatsModuleDownloads
									moduleStrings={ moduleStrings.filedownloads }
									period={ this.props.period }
									query={ query }
									summaryUrl={ this.getStatHref( 'filedownloads', query ) }
									className={ halfWidthModuleClasses }
								/>
							)
						}

						{ supportsDevicesStats && ! isOldJetpack && (
							<StatsModuleDevices
								siteId={ siteId }
								period={ this.props.period }
								query={ query }
								className={ halfWidthModuleClasses }
							/>
						) }

						{ supportsDevicesStats && isOldJetpack && (
							<StatsModuleUpgradeDevicesOverlay
								className={ halfWidthModuleClasses }
								siteId={ siteId }
								overlay={
									<StatsCardUpdateJetpackVersion
										className="stats-module__upsell stats-module__upgrade"
										siteId={ siteId }
										statType="devices"
									/>
								}
							/>
						) }
					</div>
				</div>
				{ supportsPlanUsage && (
					<StatsPlanUsage siteId={ siteId } isOdysseyStats={ isOdysseyStats } />
				) }
				{ ! shouldShowUpsells ? null : (
					<AsyncLoad require="calypso/my-sites/stats/jetpack-upsell-section" />
				) }
				<PromoCards isOdysseyStats={ isOdysseyStats } pageSlug="traffic" slug={ slug } />
				{ supportUserFeedback && <StatsFeedbackController siteId={ siteId } /> }
				<JetpackColophon />
				<AsyncLoad require="calypso/lib/analytics/track-resurrections" placeholder={ null } />
				{ this.props.upsellModalView && <StatsUpsellModal siteId={ siteId } /> }
			</div>
		);
	}

	enableStatsModule = () => {
		const { siteId, path } = this.props;
		this.props.enableJetpackStatsModule( siteId, path );
	};

	renderEnableStatsModule() {
		return (
			<EmptyContent
				illustration={ illustration404 }
				title={ translate( 'Looking for stats?' ) }
				line={
					<p>
						{ translate(
							'Enable Jetpack Stats to see detailed information about your traffic, likes, comments, and subscribers.'
						) }
					</p>
				}
				action={ translate( 'Enable Jetpack Stats' ) }
				actionCallback={ this.enableStatsModule }
			/>
		);
	}

	componentDidMount() {
		// TODO: Migrate to a query component pattern (i.e. <QueryStatsModuleSettings siteId={siteId} />).
		this.props.requestModuleSettings( this.props.siteId );
	}

	renderInsufficientPermissionsPage() {
		return (
			<EmptyContent
				illustration={ illustration404 }
				title={ translate( 'Looking for stats?' ) }
				line={
					<p>
						<div>
							{ translate( "We're sorry, but you do not have permission to access this page." ) }
						</div>
						<div>{ translate( "Please contact your site's administrator for access." ) }</div>
					</p>
				}
			/>
		);
	}

	renderBody( isInternal ) {
		if ( ! this.props.canUserViewStats ) {
			return this.renderInsufficientPermissionsPage();
		} else if ( this.props.showEnableStatsModule ) {
			return this.renderEnableStatsModule();
		}

		return this.renderStats( isInternal );
	}

	render() {
		const { isJetpack, siteId, isOdysseyStats } = this.props;
		const { period } = this.props.period;

		// Track the last viewed tab.
		// Necessary to properly configure the fixed navigation headers.
		sessionStorage.setItem( 'jp-stats-last-tab', 'traffic' );

		return (
			<Main fullWidthLayout ariaLabel={ translate( 'Jetpack Stats' ) }>
				{ config.isEnabled( 'stats/paid-wpcom-v2' ) && ! isOdysseyStats && (
					<QuerySiteFeatures siteIds={ [ siteId ] } />
				) }
				{ /* Odyssey: Google Business Profile pages are currently unsupported. */ }
				{ ! isOdysseyStats && (
					<>
						<QueryKeyringConnections />
						<QuerySiteKeyrings siteId={ siteId } />
					</>
				) }
				{ /* Odyssey: if Stats module is not enabled, the page will not be rendered. */ }
				{ ! isOdysseyStats && isJetpack && <QueryJetpackModules siteId={ siteId } /> }
				<DocumentHead title={ translate( 'Jetpack Stats' ) } />
				<PageViewTracker
					path={ `/stats/${ period }/:site` }
					title={ `Stats > ${ titlecase( period ) }` }
				/>
				<StatsGlobalValuesContext.Consumer>
					{ ( isInternal ) => this.renderBody( isInternal ) }
				</StatsGlobalValuesContext.Consumer>
			</Main>
		);
	}
}

const enableJetpackStatsModule = ( siteId, path ) =>
	withAnalytics(
		recordTracksEvent( 'calypso_jetpack_module_toggle', {
			module: 'stats',
			path,
			toggled: 'on',
		} ),
		activateModule( siteId, 'stats' )
	);

export default connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );
		const canUserManageOptions = canCurrentUser( state, siteId, 'manage_options' );
		const isJetpack = isJetpackSite( state, siteId );
		const statsAdminVersion = getJetpackStatsAdminVersion( state, siteId );
		const isOdysseyStats = config.isEnabled( 'is_running_in_jetpack_site' );

		// Odyssey Stats: This UX is not possible in Odyssey as this page would not be able to render in the first place.
		const showEnableStatsModule =
			! isOdysseyStats &&
			siteId &&
			isJetpack &&
			isJetpackModuleActive( state, siteId, 'stats' ) === false &&
			canUserManageOptions;

		// Odyssey Stats: Access control is done in PHP, so skip capability check here.
		// TODO: Fix incorrect view_stats permission on Calypso.
		//       If the user's role is missing from the site's stats dashboard access allowlist (fetched via getJetpackSettings.role),
		//       then it should be reflected in the user's view_stats capability.
		const canUserViewStats =
			isOdysseyStats || canUserManageOptions || canCurrentUser( state, siteId, 'view_stats' );

		const slug = getSelectedSiteSlug( state );
		const upsellModalView =
			config.isEnabled( 'stats/paid-wpcom-v2' ) && getUpsellModalView( state, siteId );

		const {
			supportsPlanUsage,
			supportsEmailStats,
			supportsUTMStats,
			supportsDevicesStats,
			isOldJetpack,
			supportUserFeedback,
		} = getEnvStatsFeatureSupportChecks( state, siteId );

		// Determine if the default date range should be forced to 7 days.
		const shouldForceDefaultDateRange = shouldGateStats(
			state,
			siteId,
			STATS_FEATURE_DATE_CONTROL_LAST_30_DAYS
		);

		return {
			canUserViewStats,
			isAtomic: isAtomicSite( state, siteId ),
			isJetpack,
			isSitePrivate: isPrivateSite( state, siteId ),
			siteId,
			slug,
			showEnableStatsModule,
			path: getCurrentRouteParameterized( state, siteId ),
			isOdysseyStats,
			moduleSettings: getModuleSettings( state, siteId, 'traffic' ),
			moduleToggles: getModuleToggles( state, siteId, 'traffic' ),
			upsellModalView,
			statsAdminVersion,
			supportsEmailStats,
			supportsPlanUsage,
			supportsUTMStatsFeature: supportsUTMStats,
			supportsDevicesStatsFeature: supportsDevicesStats,
			supportUserFeedback,
			isOldJetpack,
			shouldForceDefaultDateRange,
			momentSiteZone: getMomentSiteZone( state, siteId ),
		};
	},
	{
		recordGoogleEvent,
		enableJetpackStatsModule,
		recordTracksEvent,
		requestModuleSettings,
	}
)( localize( StatsSite ) );
