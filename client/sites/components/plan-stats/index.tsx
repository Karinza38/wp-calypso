import { Button, LoadingPlaceholder } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PlanStorage, { useDisplayUpgradeLink } from 'calypso/blocks/plan-storage';
import { isPlansPageUntangled } from 'calypso/lib/plans/untangling-plans-experiment';
import { useStorageAddOnAvailable } from 'calypso/lib/plans/use-storage-add-on-available';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { getCurrentPlan } from 'calypso/state/sites/plans/selectors';
import { getSelectedSite, getSelectedPurchase } from 'calypso/state/ui/selectors';
import StorageAddOnsModal from '../storage-add-ons/storage-add-ons-modal';
import { PlanBandwidth } from './plan-bandwidth';
import { PlanSiteVisits } from './plan-site-visits';
import PlanStorageBar from './plan-storage-bar';

import './style.scss';

type NeedMoreStorageProps = {
	noLink?: boolean;
	tracksEventName: string;
	onClick: ( e: React.MouseEvent< HTMLButtonElement > ) => void;
};

function NeedMoreStorage( { noLink = false, onClick, tracksEventName }: NeedMoreStorageProps ) {
	const translate = useTranslate();
	const site = useSelector( getSelectedSite );
	const dispatch = useDispatch();
	const text = translate( 'Need more storage?' );
	const isUntangled = useSelector( isPlansPageUntangled );

	if ( noLink ) {
		return text;
	}

	return (
		<Button
			plain
			href={ `/add-ons/${ site?.slug }` }
			onClick={ ( e: React.MouseEvent< HTMLButtonElement > ) => {
				if ( isUntangled ) {
					e.preventDefault();
					onClick( e );
				}
				dispatch( recordTracksEvent( tracksEventName ) );
			} }
		>
			{ text }
		</Button>
	);
}

type PlanStatsProps = {
	needMoreStorageTracksEventName: string;
};

export default function PlanStats( { needMoreStorageTracksEventName }: PlanStatsProps ) {
	const site = useSelector( getSelectedSite );
	const planDetails = site?.plan;
	const planData = useSelector( ( state ) => getCurrentPlan( state, site?.ID ) );
	const isFreePlan = planDetails?.is_free;

	const planPurchase = useSelector( getSelectedPurchase );
	const planPurchaseLoading = ! isFreePlan && planPurchase === null;
	const isLoading = ! planDetails || ! planData || planPurchaseLoading;

	const footerWrapperIsLink = useDisplayUpgradeLink( site?.ID ?? null );
	const isStorageAddOnAvailable = useStorageAddOnAvailable( site?.ID );

	const isUntangled = useSelector( isPlansPageUntangled );
	const [ isStorageAddOnsModalOpen, setIsStorageAddOnsModalOpen ] = useState( false );

	if ( isLoading ) {
		return <LoadingPlaceholder width="400px" height="100px" />;
	}
	return (
		<>
			<div className="plan-stats">
				<PlanStorage
					className="plan-storage"
					hideWhenNoStorage
					siteId={ site?.ID }
					storageBarComponent={ PlanStorageBar }
				>
					{ isStorageAddOnAvailable ? (
						<div className="plan-storage-footer">
							<NeedMoreStorage
								noLink={ footerWrapperIsLink }
								tracksEventName={ needMoreStorageTracksEventName }
								onClick={ () => setIsStorageAddOnsModalOpen( true ) }
							/>
							{ isUntangled && (
								<StorageAddOnsModal
									isOpen={ isStorageAddOnsModalOpen }
									onClose={ () => setIsStorageAddOnsModalOpen( false ) }
								/>
							) }
						</div>
					) : null }
				</PlanStorage>

				{ site && (
					<div className="plan-stats__footer">
						<PlanBandwidth siteId={ site.ID } />
						<PlanSiteVisits siteId={ site.ID } />
					</div>
				) }
			</div>
		</>
	);
}
