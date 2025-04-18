import { getThemeIdFromStylesheet } from '@automattic/data-stores';
import { DEFAULT_GLOBAL_STYLES_VARIATION_SLUG } from '@automattic/global-styles';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from 'react';
import { SITE_STORE } from 'calypso/landing/stepper/stores';
import { useDispatch as useReduxDispatch } from 'calypso/state';
import { setActiveTheme, activateOrInstallThenActivate } from 'calypso/state/themes/actions';
import { useSiteData } from './use-site-data';
import type { SiteSelect } from '@automattic/data-stores';
import type { Design, DesignOptions } from '@automattic/design-picker';
import type { AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';

export const useActivateDesign = () => {
	const reduxDispatch = useReduxDispatch();
	const { site } = useSiteData();
	const isJetpack = useSelect(
		( select ) => site?.ID && ( select( SITE_STORE ) as SiteSelect ).isJetpackSite( site?.ID ),
		[ site?.ID ]
	);

	const isAtomic = useSelect(
		( select ) => site?.ID && ( select( SITE_STORE ) as SiteSelect ).isSiteAtomic( site.ID ),
		[ site?.ID ]
	);

	const isJetpackOrAtomic = isJetpack || isAtomic;

	const { installTheme, setDesignOnSite, assembleSite } = useDispatch( SITE_STORE );

	const activateDesign = useCallback(
		async ( design: Design, designOptions: DesignOptions ) => {
			const themeId = getThemeIdFromStylesheet( design.recipe?.stylesheet ?? '' ) ?? '';
			if ( design?.is_virtual ) {
				const activeThemeStylesheet = await reduxDispatch(
					activateOrInstallThenActivate( themeId, site?.ID ?? 0, {
						source: 'assembler',
					} ) as ThunkAction< PromiseLike< string >, any, any, AnyAction >
				);
				await assembleSite( site?.ID, activeThemeStylesheet, {
					homeHtml: design.recipe?.pattern_html,
					headerHtml: design.recipe?.header_html,
					footerHtml: design.recipe?.footer_html,
					siteSetupOption: 'assembler-virtual-theme',
				} );
				return;
			}

			// Try to install the theme on Jetpack sites.
			let isNewlyInstalledTheme = false;
			if ( isJetpackOrAtomic ) {
				try {
					await installTheme( site?.ID, themeId );
					isNewlyInstalledTheme = true;
				} catch ( error: any ) {
					if ( error.error !== 'theme_already_installed' ) {
						throw error;
					}
				}
			}

			const activeTheme = await setDesignOnSite( site?.ID, design, {
				enableThemeSetup: ! isJetpackOrAtomic,
				...designOptions,
				// Prevent resetting global styles when a theme was recently installed generating an fatal error.
				// See https://github.com/Automattic/wp-calypso/issues/101342.
				styleVariation:
					isNewlyInstalledTheme &&
					designOptions.styleVariation?.slug === DEFAULT_GLOBAL_STYLES_VARIATION_SLUG
						? undefined
						: designOptions.styleVariation,
			} );

			await reduxDispatch( setActiveTheme( site?.ID || -1, activeTheme ) );
		},
		[
			site,
			getThemeIdFromStylesheet,
			reduxDispatch,
			activateOrInstallThenActivate,
			assembleSite,
			installTheme,
			setDesignOnSite,
			setActiveTheme,
			isJetpackOrAtomic,
		]
	);

	return activateDesign;
};
