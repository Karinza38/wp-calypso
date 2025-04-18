import { ProgressBar } from '@automattic/components';
import debugModule from 'debug';
import { localize } from 'i18n-calypso';
import { get } from 'lodash';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withLocalizedMoment } from 'calypso/components/localized-moment';
import Notice from 'calypso/components/notice';
import NoticeAction from 'calypso/components/notice/notice-action';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import { Interval, EVERY_TEN_SECONDS } from 'calypso/lib/interval';
import { getSyncStatus, scheduleJetpackFullysync } from 'calypso/state/jetpack-sync/actions';
import syncSelectors from 'calypso/state/jetpack-sync/selectors';
import { getSelectedSite } from 'calypso/state/ui/selectors';

import './style.scss';

/*
 * Module variables
 */
const debug = debugModule( 'calypso:site-settings:jetpack-sync-panel' );
const SYNC_STATUS_ERROR_NOTICE_THRESHOLD = 3; // Only show sync status error notice if >= this number

class JetpackSyncPanel extends Component {
	componentDidMount() {
		this.fetchSyncStatus();
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.siteId !== this.props.siteId ) {
			this.fetchSyncStatus();
		}
	}

	fetchSyncStatus = () => {
		this.props.getSyncStatus( this.props.siteId );
	};

	isErrored = () => {
		const syncRequestError = get( this.props, 'fullSyncRequest.error' );
		const syncStatusErrorCount = get( this.props, 'syncStatus.errorCounter', 0 );
		return !! ( syncRequestError || syncStatusErrorCount >= SYNC_STATUS_ERROR_NOTICE_THRESHOLD );
	};

	shouldDisableSync = () => {
		return !! ( this.props.isFullSyncing || this.props.isPendingSyncStart );
	};

	onSyncRequestButtonClick = ( event ) => {
		event.preventDefault();
		debug( 'Perform full sync button clicked' );
		recordTracksEvent( 'calypso_jetpack_sync_panel_request_button_clicked' );
		this.props.scheduleJetpackFullysync( this.props.siteId );
	};

	onTryAgainClick = ( event ) => {
		event.preventDefault();
		debug( 'Try again button clicked' );
		recordTracksEvent( 'calypso_jetpack_sync_panel_try_again_button_clicked', {
			errorCode: get( this.props, 'fullSyncRequest.error.error', '' ),
			errorMsg: get( this.props, 'fullSyncRequest.error.message', '' ),
		} );
		this.props.scheduleJetpackFullysync( this.props.siteId );
	};

	onClickDebug = () => {
		debug( 'Clicked check connection button' );
		recordTracksEvent( 'calypso_jetpack_sync_panel_check_connection_button_clicked', {
			error_code: get( this.props, 'syncStatus.error.error', '' ),
			error_msg: get( this.props, 'syncStatus.error.message', '' ),
		} );
	};

	renderErrorNotice = () => {
		const syncRequestError = get( this.props, 'fullSyncRequest.error' );
		const syncStatusErrorCount = get( this.props, 'syncStatus.errorCounter', 0 );
		const { translate } = this.props;

		let errorNotice = null;
		if ( syncStatusErrorCount >= SYNC_STATUS_ERROR_NOTICE_THRESHOLD ) {
			const adminUrl = get( this.props, 'site.options.admin_url' );
			errorNotice = (
				<Notice isCompact status="is-error">
					{ translate( '%(site)s is unresponsive.', {
						args: {
							site: get( this.props, 'site.name' ),
						},
					} ) }
					{ adminUrl && (
						<NoticeAction
							onClick={ this.onClickDebug }
							href={ adminUrl + 'admin.php?page=jetpack-debugger' }
						>
							{ translate( 'Check connection' ) }
						</NoticeAction>
					) }
				</Notice>
			);
		} else if ( syncRequestError ) {
			errorNotice = (
				<Notice isCompact status="is-error">
					{ syncRequestError.message
						? syncRequestError.message
						: translate( 'There was an error scheduling a full sync.' ) }
					{
						// We show a Try again action for a generic error on the assumption
						// that the error was a network issue.
						//
						// If an error message was returned from the API, then there's likely
						// a good reason the request failed, such as an unauthorized user.
						! syncRequestError.message && (
							<NoticeAction onClick={ this.onTryAgainClick }>
								{ translate( 'Try again' ) }
							</NoticeAction>
						)
					}
				</Notice>
			);
		}

		return errorNotice;
	};

	renderStatusNotice = () => {
		if ( this.isErrored() ) {
			return null;
		}

		const finished = get( this.props, 'syncStatus.finished' );
		const { isPendingSyncStart, isFullSyncing, moment, translate } = this.props;
		const finishedTimestamp = parseInt( finished, 10 ) * 1000;
		const finishedTimestampObj = moment( finishedTimestamp );

		let text = '';
		if ( isPendingSyncStart ) {
			text = translate( 'Full sync will begin shortly' );
		} else if ( isFullSyncing ) {
			text = translate( 'Full sync in progress' );
		} else if ( finishedTimestamp > 1000 && finishedTimestampObj.isValid() ) {
			text = translate( 'Last fully synced %(ago)s', {
				args: {
					ago: finishedTimestampObj.fromNow(),
				},
			} );
		}

		if ( ! text ) {
			return null;
		}

		return <div className="jetpack-sync-panel__status-notice">{ text }</div>;
	};

	renderProgressBar = () => {
		if ( ! this.shouldDisableSync() || this.isErrored() ) {
			return null;
		}

		return <ProgressBar isPulsing value={ this.props.syncProgress || 0 } />;
	};

	render() {
		const { translate } = this.props;
		return (
			<div className="jetpack-sync-panel">
				<div className="jetpack-sync-panel__action" id="jetpackSyncPanelAction">
					{ translate(
						'Jetpack Sync keeps your WordPress.com dashboard up to date. ' +
							'Data is sent from your site to the WordPress.com dashboard regularly to provide a faster experience. '
					) }

					{ ! this.shouldDisableSync() &&
						translate(
							'If you suspect some data is missing, you can {{link}}initiate a sync manually{{/link}}.',
							{
								components: {
									link: (
										<a href="#jetpackSyncPanelAction" onClick={ this.onSyncRequestButtonClick } />
									),
								},
							}
						) }
				</div>

				{ this.renderErrorNotice() }
				{ this.renderStatusNotice() }
				{ this.renderProgressBar() }
				{ this.shouldDisableSync() && (
					<Interval onTick={ this.fetchSyncStatus } period={ EVERY_TEN_SECONDS } />
				) }
			</div>
		);
	}
}

export default connect(
	( state ) => {
		const site = getSelectedSite( state );
		const siteId = site.ID;
		return {
			site,
			siteId,
			syncStatus: syncSelectors.getSyncStatus( state, siteId ),
			fullSyncRequest: syncSelectors.getFullSyncRequest( state, siteId ),
			isPendingSyncStart: syncSelectors.isPendingSyncStart( state, siteId ),
			isFullSyncing: syncSelectors.isFullSyncing( state, siteId ),
			syncProgress: syncSelectors.getSyncProgressPercentage( state, siteId ),
		};
	},
	{ getSyncStatus, scheduleJetpackFullysync }
)( localize( withLocalizedMoment( JetpackSyncPanel ) ) );
