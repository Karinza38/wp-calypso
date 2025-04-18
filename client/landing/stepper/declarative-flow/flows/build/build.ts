import { OnboardSelect } from '@automattic/data-stores';
import { BUILD_FLOW } from '@automattic/onboarding';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { useMemo, useRef } from 'react';
import { useSite } from 'calypso/landing/stepper/hooks/use-site';
import { getStepFromURL } from 'calypso/landing/stepper/utils/get-flow-from-url';
import { skipLaunchpad } from 'calypso/landing/stepper/utils/skip-launchpad';
import { triggerGuidesForStep } from 'calypso/lib/guides/trigger-guides-for-step';
import { shouldShowLaunchpadFirst } from 'calypso/state/selectors/should-show-launchpad-first';
import { STEPPER_TRACKS_EVENT_SIGNUP_STEP_START } from '../../../constants';
import { useExitFlow } from '../../../hooks/use-exit-flow';
import { useSiteIdParam } from '../../../hooks/use-site-id-param';
import { useSiteSlug } from '../../../hooks/use-site-slug';
import { ONBOARD_STORE } from '../../../stores';
import { useLaunchpadDecider } from '../../internals/hooks/use-launchpad-decider';
import { STEPS } from '../../internals/steps';
import { Flow, ProvidedDependencies } from '../../internals/types';

const steps = [ STEPS.LAUNCHPAD, STEPS.PROCESSING ];

const build: Flow = {
	name: BUILD_FLOW,
	get title() {
		return 'WordPress';
	},
	isSignupFlow: false,
	useSteps() {
		return steps;
	},
	useTracksEventProps() {
		const goals = useSelect(
			( select ) => ( select( ONBOARD_STORE ) as OnboardSelect ).getGoals(),
			[]
		);

		const site = useSite();
		const step = getStepFromURL();

		// we are only interested in the initial values and not when they values change
		const initialGoals = useRef( goals );

		const tracksEventProps = useMemo(
			() => ( {
				eventsProperties: {
					[ STEPPER_TRACKS_EVENT_SIGNUP_STEP_START ]: {
						...( initialGoals.current.length && {
							goals: initialGoals.current.join( ',' ),
						} ),
					},
				},
			} ),
			[ initialGoals ]
		);

		if ( site && shouldShowLaunchpadFirst( site ) && step === 'launchpad' ) {
			//prevent track events from firing until we're sure we won't redirect away from Launchpad
			return {
				isLoading: true,
				eventsProperties: {},
			};
		}

		return tracksEventProps;
	},

	useStepNavigation( _currentStep, navigate ) {
		const flowName = this.name;
		const siteId = useSiteIdParam();
		const siteSlug = useSiteSlug();
		const { exitFlow } = useExitFlow( { navigate, processing: true } );

		triggerGuidesForStep( flowName, _currentStep );

		const { postFlowNavigator, initializeLaunchpadState } = useLaunchpadDecider( {
			exitFlow,
			navigate,
		} );

		const submit = ( providedDependencies: ProvidedDependencies = {} ) => {
			switch ( _currentStep ) {
				case 'processing':
					if ( providedDependencies?.goToHome && providedDependencies?.siteSlug ) {
						return window.location.replace(
							addQueryArgs( `/home/${ siteId ?? providedDependencies?.siteSlug }`, {
								celebrateLaunch: true,
								launchpadComplete: true,
							} )
						);
					}

					initializeLaunchpadState( {
						siteId,
						siteSlug: ( providedDependencies?.siteSlug ?? siteSlug ) as string,
					} );

					return postFlowNavigator( { siteId, siteSlug } );
				case 'launchpad': {
					return navigate( 'processing' );
				}
			}
			return providedDependencies;
		};

		const goNext = async () => {
			switch ( _currentStep ) {
				case 'launchpad':
					skipLaunchpad( {
						siteId,
						siteSlug,
					} );
					return;
				default:
					return navigate( 'launchpad' );
			}
		};

		return { goNext, submit };
	},
};

export default build;
