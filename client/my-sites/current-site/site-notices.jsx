import { isEnabled } from '@automattic/calypso-config';
import { useSelector } from 'react-redux';
import AsyncLoad from 'calypso/components/async-load';
import CalypsoShoppingCartProvider from 'calypso/my-sites/checkout/calypso-shopping-cart-provider';
import { getSelectedSite } from 'calypso/state/ui/selectors';

/**
 * SiteNotices component that renders all the notices related to a site
 * This includes domain warnings, site notices, and stale cart items
 */
function SiteNotices() {
	const selectedSite = useSelector( getSelectedSite );

	if ( ! selectedSite ) {
		return null;
	}

	return (
		<>
			{ isEnabled( 'current-site/domain-warning' ) && (
				<AsyncLoad require="calypso/my-sites/current-site/domain-warnings" placeholder={ null } />
			) }
			{ isEnabled( 'current-site/stale-cart-notice' ) && (
				<CalypsoShoppingCartProvider>
					<AsyncLoad
						require="calypso/my-sites/current-site/stale-cart-items-notice"
						placeholder={ null }
					/>
				</CalypsoShoppingCartProvider>
			) }
			{ isEnabled( 'current-site/notice' ) && (
				<AsyncLoad
					require="calypso/my-sites/current-site/notice"
					placeholder={ null }
					site={ selectedSite }
				/>
			) }
		</>
	);
}

export default SiteNotices;
