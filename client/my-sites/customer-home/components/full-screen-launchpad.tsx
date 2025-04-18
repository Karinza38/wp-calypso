import { recordTracksEvent } from '@automattic/calypso-analytics';
import { CircularProgressBar } from '@automattic/components';
import {
	updateLaunchpadSettings,
	useSortedLaunchpadTasks,
	OnboardSelect,
} from '@automattic/data-stores';
import { Launchpad, Task } from '@automattic/launchpad';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useI18n } from '@wordpress/react-i18n';
import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useHomeLayoutQuery from 'calypso/data/home/use-home-layout-query';
import { ONBOARD_STORE } from 'calypso/landing/stepper/stores';
import { skipLaunchpad } from 'calypso/landing/stepper/utils/skip-launchpad';
import { launchSiteApi } from 'calypso/lib/signup/step-actions';
import { useDispatch } from 'calypso/state';
import { requestSite } from 'calypso/state/sites/actions';
import { getSite } from 'calypso/state/sites/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import { AppState } from 'calypso/types';
import { useMyHomeCardLaunchpad } from '../cards/launchpad/use-my-home-card-launchpad';
import './full-screen-launchpad.scss';

export const FullScreenLaunchpad = ( {
	onClose,
	onSiteLaunch,
}: {
	onClose: () => void;
	onSiteLaunch: () => void;
} ): JSX.Element | null => {
	const dispatch = useDispatch();
	const { __ } = useI18n();
	const [ isLaunching, setIsLaunching ] = useState( false );
	const siteId = useSelector( getSelectedSiteId ) || 0;
	const site = useSelector( ( state: AppState ) => getSite( state, siteId ) );
	const checklistSlug = site?.options?.site_intent ?? '';
	const layout = useHomeLayoutQuery( siteId || null );
	const goals = useSelect(
		( select ) => ( select( ONBOARD_STORE ) as OnboardSelect ).getGoals(),
		[]
	);

	const launchpadContext = 'focused-customer-home';

	const {
		siteSlug,
		isDismissed,
		numberOfSteps,
		completedSteps,
		launchpadTitle,
		hasChecklist,
		refetch,
	} = useMyHomeCardLaunchpad( {
		checklistSlug,
		launchpadContext,
	} );

	const onSiteLaunched = async () => {
		setIsLaunching( true );
		launchSiteApi(
			async () => {
				try {
					await updateLaunchpadSettings( siteId, {
						checklist_statuses: { site_launched: true },
					} );

					await refetch?.();
					await layout?.refetch();
					await dispatch( requestSite( siteId ) );
					recordTracksEvent( 'calypso_full_screen_launchpad_launch_site', {
						context: launchpadContext,
						goals: goals.join( ',' ),
					} );
					onSiteLaunch();
				} finally {
					setIsLaunching( false );
				}
			},
			{ siteSlug }
		);
	};

	const onSkipLaunchpad = async () => {
		onClose();

		await skipLaunchpad( {
			siteId,
			siteSlug,
			redirectToHome: false,
		} );

		recordTracksEvent( 'calypso_full_screen_launchpad_skip', {
			context: launchpadContext,
			goals: goals.join( ',' ),
		} );

		dispatch( requestSite( siteId ) );
	};

	const {
		data: { checklist },
	} = useSortedLaunchpadTasks( siteSlug, checklistSlug, launchpadContext );

	if ( isDismissed ) {
		return null;
	}

	const launchSiteTask = checklist?.find( ( task: Task ) => task.isLaunchTask );
	const isLaunchSiteTaskComplete = launchSiteTask?.completed;

	const isAllTasksCompleted =
		hasChecklist &&
		numberOfSteps > 0 &&
		completedSteps >= numberOfSteps - ( launchSiteTask ? 1 : 0 );

	return (
		<div data-testid="launchpad-first" className="is-launchpad-first" css={ { width: '100%' } }>
			<div
				className={ clsx( 'customer-home-launchpad customer-home__card is-small-hero', {
					'all-tasks-completed': isAllTasksCompleted,
				} ) }
			>
				<div className="customer-home__launchpad-header">
					<CircularProgressBar
						size={ 40 }
						enableDesktopScaling
						numberOfSteps={ numberOfSteps - ( launchSiteTask ? 1 : 0 ) }
						currentStep={ completedSteps - ( isLaunchSiteTaskComplete ? 1 : 0 ) }
					/>
					<h2>{ ! isAllTasksCompleted ? __( "Let's get started!" ) : __( "You're all set!" ) }</h2>
					<span>{ ! isAllTasksCompleted && launchpadTitle }</span>
				</div>
				<Launchpad
					siteSlug={ siteSlug }
					checklistSlug={ checklistSlug }
					launchpadContext={ launchpadContext }
					onPostFilterTasks={ ( tasks ) => tasks.filter( ( task ) => ! task.isLaunchTask ) }
					highlightNextAction
				/>
				<div className="launchpad-actions">
					{ launchSiteTask && isAllTasksCompleted && (
						<Button
							onClick={ onSiteLaunched }
							className="launchpad-site-launch"
							variant="primary"
							isBusy={ isLaunching }
							disabled={ isLaunching }
						>
							{ launchSiteTask?.title }
						</Button>
					) }
					<Button
						style={ { color: 'var(--color-neutral-100)' } }
						variant="link"
						onClick={ onSkipLaunchpad }
						disabled={ isLaunching }
					>
						{ __( 'Skip to dashboard' ) }
					</Button>
				</div>
			</div>
		</div>
	);
};
