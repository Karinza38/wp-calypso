import { captureException } from '@automattic/calypso-sentry';
import { CircularProgressBar } from '@automattic/components';
import { LaunchpadContainer } from '@automattic/launchpad';
import { StepContainer } from '@automattic/onboarding';
import { useCallback, useEffect } from 'react';
import { MigrationStatus } from 'calypso/data/site-migration/landing/types';
import { useUpdateMigrationStatus } from 'calypso/data/site-migration/landing/use-update-migration-status';
import { useMigrationStickerMutation } from 'calypso/data/site-migration/use-migration-sticker';
import { useHostingProviderUrlDetails } from 'calypso/data/site-profiler/use-hosting-provider-url-details';
import { HOW_TO_MIGRATE_OPTIONS } from 'calypso/landing/stepper/constants';
import { usePrepareSiteForMigration } from 'calypso/landing/stepper/hooks/use-prepare-site-for-migration';
import { useQuery } from 'calypso/landing/stepper/hooks/use-query';
import { useSite } from 'calypso/landing/stepper/hooks/use-site';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import { useDispatch } from 'calypso/state';
import { resetSite } from 'calypso/state/sites/actions';
import { HostingBadge } from './hosting-badge';
import { MigrationInstructions } from './migration-instructions';
import { ProvisionStatus } from './provision-status';
import { SitePreview } from './site-preview';
import { Steps } from './steps';
import { useSteps } from './steps/use-steps';
import { SupportNudge } from './support-nudge';
import type { Step } from '../../types';
import './style.scss';

interface PreparationEventsHookOptions {
	migrationKeyStatus: string;
	preparationCompleted: boolean;
	preparationError: Error | null;
	fromUrl: string;
	flow: string;
	siteId: number;
}

const usePreparationEventsAndLogs = ( {
	migrationKeyStatus,
	preparationCompleted,
	preparationError,
	fromUrl,
	flow,
	siteId,
}: PreparationEventsHookOptions ) => {
	useEffect( () => {
		if ( 'error' === migrationKeyStatus ) {
			recordTracksEvent(
				'calypso_onboarding_site_migration_instructions_unable_to_get_migration_key',
				{
					from: fromUrl,
				}
			);
		}
	}, [ migrationKeyStatus, fromUrl ] );

	useEffect( () => {
		if ( preparationCompleted ) {
			recordTracksEvent( 'calypso_site_migration_instructions_preparation_complete' );
		}
	}, [ preparationCompleted ] );

	useEffect( () => {
		if ( preparationError ) {
			const logError = preparationError as unknown as { path: string; message: string };

			captureException( preparationError, {
				extra: {
					message: logError?.message,
					path: logError?.path,
				},
				tags: {
					blog_id: siteId,
					calypso_section: 'setup',
					flow,
					stepName: 'site-migration-instructions',
					context: 'failed_to_prepare_site_for_migration',
				},
			} );
		}
	}, [ flow, preparationError, siteId ] );
};

const SiteMigrationInstructions: Step< {
	submits:
		| { destination: 'migration-started' }
		| { how: ( typeof HOW_TO_MIGRATE_OPTIONS )[ 'DO_IT_FOR_ME' ] };
} > = function ( { navigation, flow } ) {
	const site = useSite();
	const siteId = site?.ID ?? 0;
	const queryParams = useQuery();
	const fromUrl = queryParams.get( 'from' ) ?? '';
	const dispatch = useDispatch();

	const { mutate: updateMigrationStatus } = useUpdateMigrationStatus( siteId );

	useEffect( () => {
		if ( siteId ) {
			updateMigrationStatus( { status: MigrationStatus.PENDING_DIY } );
		}
	}, [ siteId, updateMigrationStatus ] );

	// Delete migration sticker.
	const { deleteMigrationSticker } = useMigrationStickerMutation();

	useEffect( () => {
		if ( siteId ) {
			deleteMigrationSticker( siteId );
		}
	}, [ deleteMigrationSticker, siteId ] );

	// Site preparation.
	const {
		detailedStatus,
		completed: preparationCompleted,
		error: preparationError,
		migrationKey,
	} = usePrepareSiteForMigration( siteId, fromUrl, { retry: 10 } );

	const migrationKeyStatus = detailedStatus.migrationKey;

	// Register events and logs.
	usePreparationEventsAndLogs( {
		migrationKeyStatus,
		preparationCompleted,
		preparationError,
		fromUrl,
		flow,
		siteId,
	} );

	const preventUnload = useCallback(
		( event: BeforeUnloadEvent ) => {
			if ( ! preparationCompleted ) {
				event.returnValue = true; // Safari iOS https://caniuse.com/mdn-api_window_beforeunload_event_preventdefault_activation
				event.preventDefault(); // Modern browsers
			}
		},
		[ preparationCompleted ]
	);

	useEffect( () => {
		window.addEventListener( 'beforeunload', preventUnload );
		return () => {
			window.removeEventListener( 'beforeunload', preventUnload );
		};
	}, [ preparationCompleted, preventUnload ] );

	// Hosting details.
	const { data: hostingDetails } = useHostingProviderUrlDetails( fromUrl );
	const showHostingBadge = ! hostingDetails.is_unknown && ! hostingDetails.is_a8c;

	// Steps.
	const onCompleteSteps = () => {
		dispatch( resetSite( siteId ) );
		navigation.submit?.( { destination: 'migration-started' } );
	};

	const showMigrationKeyFallback =
		( ! migrationKeyStatus || migrationKeyStatus === 'error' ) && preparationCompleted;

	const { steps, completedSteps } = useSteps( {
		fromUrl,
		migrationKey: migrationKey ?? '',
		preparationError,
		showMigrationKeyFallback,
		onComplete: onCompleteSteps,
	} );

	const withPreview = fromUrl !== '';

	const navigateToDoItForMe = useCallback( () => {
		navigation.submit?.( { how: HOW_TO_MIGRATE_OPTIONS.DO_IT_FOR_ME } );
	}, [ navigation ] );

	const migrationInstructions = (
		<MigrationInstructions
			withPreview={ withPreview }
			progress={
				<CircularProgressBar
					size={ 40 }
					enableDesktopScaling
					numberOfSteps={ steps.length }
					currentStep={ completedSteps }
				/>
			}
		>
			<div className="site-migration-instructions__steps">
				<Steps steps={ steps } />
			</div>
			<ProvisionStatus status={ detailedStatus } />
		</MigrationInstructions>
	);

	const stepContent = withPreview ? (
		<LaunchpadContainer sidebar={ migrationInstructions }>
			{ showHostingBadge && <HostingBadge hostingName={ hostingDetails.name } /> }
			<SitePreview />
		</LaunchpadContainer>
	) : (
		<div className="site-migration-instructions__container-without-preview">
			{ migrationInstructions }
		</div>
	);

	return (
		<StepContainer
			stepName="site-migration-instructions"
			isFullLayout
			hideFormattedHeader
			className="is-step-site-migration-instructions site-migration-instructions--launchpad"
			hideSkip
			hideBack
			stepContent={ stepContent }
			recordTracksEvent={ recordTracksEvent }
			customizedActionButtons={ <SupportNudge onAskForHelp={ navigateToDoItForMe } /> }
		/>
	);
};

export default SiteMigrationInstructions;
