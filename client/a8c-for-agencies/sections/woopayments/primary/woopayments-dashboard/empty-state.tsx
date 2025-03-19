import { Button } from '@wordpress/components';
import { useTranslate } from 'i18n-calypso';
import { CONTACT_URL_HASH_FRAGMENT_WITH_PRODUCT } from 'calypso/a8c-for-agencies/components/a4a-contact-support-widget';
import CopyToClipboardButton from 'calypso/a8c-for-agencies/components/copy-to-clipboard-button';
import PageSectionColumns from 'calypso/a8c-for-agencies/components/page-section-columns';
import SimpleList from 'calypso/a8c-for-agencies/components/simple-list';
import { extractStrings } from 'calypso/a8c-for-agencies/lib/translation';
import backgroundImage1 from 'calypso/assets/images/a8c-for-agencies/woopayments/background-image-1.svg';
import cartImage from 'calypso/assets/images/a8c-for-agencies/woopayments/cart.png';
import ccImage from 'calypso/assets/images/a8c-for-agencies/woopayments/cc-image.png';
import demoImage from 'calypso/assets/images/a8c-for-agencies/woopayments/demo.png';
import wooPaymentsLogo from 'calypso/assets/images/a8c-for-agencies/woopayments/logo.svg';
import { useDispatch } from 'calypso/state';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import AddWooPaymentsToSite from '../../add-woopayments-to-site';

const WooPaymentsDashboardEmptyState = () => {
	const translate = useTranslate();
	const dispatch = useDispatch();

	const listItems1 = [
		translate(
			'WooPayments is available in {{a}}38 countries{{/a}} and accepts payments in 135+ currencies, no other extensions needed.',
			{
				components: {
					a: (
						<a
							href="https://woocommerce.com/document/woopayments/compatibility/countries/#supported-countries"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_benefits_countries_link_click' )
								);
							} }
						/>
					),
				},
			}
		),
		translate(
			'Get started for free. Pay-as-you-go fees per transaction. There are no monthly fees, either. {{a}}Learn more about WooPayments fees{{/a}}.',
			{
				components: {
					a: (
						<a
							href="https://woocommerce.com/document/woopayments/fees-and-debits/fees"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch( recordTracksEvent( 'calypso_a4a_woopayments_benefits_fees_link_click' ) );
							} }
						/>
					),
				},
			}
		),
		translate(
			'Multi-Currency support is built-in. Accept payments in 135+ currencies using WooPayments.'
		),
		translate(
			'Increase conversions by enabling payment methods including {{wooPay}}WooPay{{/wooPay}}, {{applePay}}Apple Pay®{{/applePay}}, {{googlePay}}Google Pay{{/googlePay}}, {{iDeal}}iDeal{{/iDeal}}, {{p24}}P24{{/p24}}, {{eps}}EPS{{/eps}}, and {{bancontact}}Bancontact{{/bancontact}}.',
			{
				components: {
					wooPay: (
						<a
							href="https://woocommerce.com/woopay-businesses"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_benefits_wooPay_link_click' )
								);
							} }
						/>
					),
					applePay: (
						<a
							href="https://woocommerce.com/document/woopayments/payment-methods/apple-pay"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_benefits_applePay_link_click' )
								);
							} }
						/>
					),
					googlePay: (
						<a
							href="https://woocommerce.com/document/woopayments/payment-methods/google-pay"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_benefits_googlePay_link_click' )
								);
							} }
						/>
					),
					iDeal: (
						<a
							href="https://woocommerce.com/woocommerce-payments-ideal"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_benefits_iDeal_link_click' )
								);
							} }
						/>
					),
					p24: (
						<a
							href="https://woocommerce.com/woopayments-p24"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch( recordTracksEvent( 'calypso_a4a_woopayments_benefits_p24_link_click' ) );
							} }
						/>
					),
					eps: (
						<a
							href="https://woocommerce.com/woocommerce-payments-eps"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch( recordTracksEvent( 'calypso_a4a_woopayments_benefits_eps_link_click' ) );
							} }
						/>
					),
					bancontact: (
						<a
							href="https://woocommerce.com/woocommerce-payments-bancontact"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_benefits_bancontact_link_click' )
								);
							} }
						/>
					),
				},
			}
		),
		translate(
			'You may be eligible to earn up to {{a}}20% discount on Payment Processing Fees{{/a}}.',
			{
				components: {
					a: (
						<a
							href="https://woocommerce.com/terms-conditions/woopayments-promotion"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_benefits_discount_link_click' )
								);
							} }
						/>
					),
				},
			}
		),
	];

	const listItems2 = [
		translate(
			'Enable buy now, pay later (BNPL) in one click. Sell more and reach new customers with {{a}}top BNPL options{{/a}} built into your dashboard (not available in all geographies).',
			{
				components: {
					a: (
						<a
							href="https://woocommerce.com/buy-now-pay-later"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch( recordTracksEvent( 'calypso_a4a_woopayments_benefits_bnpl_link_click' ) );
							} }
						/>
					),
				},
			}
		),
		translate(
			"Simplify your workflow. No more logging into third-party payment processor sites - manage everything from the comfort of your store's dashboard."
		),
		translate(
			'Set a custom payout schedule to get your funds into your bank account as often as you need — daily, weekly, monthly, or even on-demand.'
		),
		translate( 'Reduce cart abandonment with a streamlined checkout flow.' ),
	];

	return (
		<div>
			<PageSectionColumns>
				<PageSectionColumns.Column>
					<div className="woopayments-dashboard-empty-state__content">
						<img src={ wooPaymentsLogo } alt="WooPayments" />
						<div className="woopayments-dashboard-empty-state__content-body">
							<div className="woopayments-dashboard-empty-state__heading">
								{ translate( 'Earn revenue share when clients use WooPayments' ) }
							</div>
							<div className="woopayments-dashboard-empty-state__description">
								{ translate(
									"Accept credit/debit cards and local payment options with no setup or monthly fees. Earn revenue share of 5 basis points on transactions from your clients' sites within Automattic for Agencies."
								) }
							</div>
						</div>
						<AddWooPaymentsToSite />
					</div>
				</PageSectionColumns.Column>
				<PageSectionColumns.Column alignCenter>
					<img src={ ccImage } alt="WooPayments" />
				</PageSectionColumns.Column>
			</PageSectionColumns>

			<PageSectionColumns
				background={ {
					isDarkBackground: true,
					image: backgroundImage1,
					color: '#720EEC',
				} }
			>
				<PageSectionColumns.Column heading={ translate( 'How to earn revenue share' ) }>
					<>
						<div className="woopayments-dashboard-empty-state__description">
							<div>
								{ translate(
									'To qualify for revenue sharing, you must install and connect the Automattic for Agencies plugin and WooPayments extension on your client sites. We recommend using this marketplace to install WooPayments after adding the Automattic for Agencies plugin for easier license and client site management. {{a}}Learn more{{/a}} ↗',
									{
										components: {
											a: (
												<a
													href="https://agencieshelp.automattic.com/knowledge-base/earn-revenue-share-when-clients-use-woopayments/"
													target="_blank"
													rel="noopener noreferrer"
													onClick={ () => {
														dispatch(
															recordTracksEvent( 'calypso_a4a_woopayments_learn_more_button_click' )
														);
													} }
												/>
											),
										},
									}
								) }
							</div>
							<div>
								{ translate(
									'You will receive a revenue share of 5 basis points on new Total Payments Volume (“TPV”) on client sites through June 30, 2025. {{a}}View full terms{{/a}} ↗',
									{
										components: {
											a: (
												<a
													href="https://agencieshelp.automattic.com/knowledge-base/earn-revenue-share-when-clients-use-woopayments/"
													target="_blank"
													rel="noopener noreferrer"
													onClick={ () => {
														dispatch(
															recordTracksEvent( 'calypso_a4a_woopayments_view_terms_button_click' )
														);
													} }
												/>
											),
										},
									}
								) }
							</div>
						</div>
						<Button
							__next40pxDefaultSize
							href={ CONTACT_URL_HASH_FRAGMENT_WITH_PRODUCT }
							className="woopayments-dashboard-empty-state__button"
							onClick={ () => {
								dispatch( recordTracksEvent( 'calypso_a4a_woopayments_contact_us_button_click' ) );
							} }
						>
							{ translate( 'Have questions? Contact us' ) }
						</Button>
					</>
				</PageSectionColumns.Column>
			</PageSectionColumns>

			<PageSectionColumns>
				<PageSectionColumns.Column heading={ translate( 'About WooPayments' ) }>
					<div className="woopayments-dashboard-empty-state__description">
						<div>
							{ translate(
								"With WooPayments, you can collect payments, track cash flow, handle disputes, and manage recurring revenue directly from your store's dashboard — without needing to log into a third-party platform."
							) }
						</div>
						<div>
							{ translate(
								'WooPayments simplifies the payment process for you and your customers, leaving you with more time to focus on growing your business. This fully integrated solution is the only payment method designed exclusively for WooCommerce, by Woo.'
							) }
						</div>
					</div>
				</PageSectionColumns.Column>
				<PageSectionColumns.Column alignCenter>
					<img src={ cartImage } alt="WooPayments" />
				</PageSectionColumns.Column>
			</PageSectionColumns>

			<PageSectionColumns
				heading={
					<>
						<span>{ translate( 'Benefits to share with your client' ) }</span>
						<CopyToClipboardButton
							textToCopy={ [ ...listItems1, ...listItems2 ]
								.map( ( item ) => `• ${ extractStrings( item ) }` )
								.join( '\n' ) }
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_copy_benefits_button_click' )
								);
							} }
						/>
					</>
				}
				background={ {
					color: '#F2EDFF',
				} }
			>
				<PageSectionColumns.Column>
					<SimpleList
						className="woopayments-dashboard-empty-state__list"
						applyCoreStyles
						items={ listItems1 }
					/>
				</PageSectionColumns.Column>
				<PageSectionColumns.Column>
					<SimpleList
						className="woopayments-dashboard-empty-state__list"
						applyCoreStyles
						items={ listItems2 }
					/>
				</PageSectionColumns.Column>
			</PageSectionColumns>

			<PageSectionColumns>
				<PageSectionColumns.Column
					heading={ translate( 'Still undecided if WooPayments is right for your clients?' ) }
				>
					<>
						<div className="woopayments-dashboard-empty-state__description">
							{ translate(
								"Explore all of WooPayments' benefits, browse the technical documentation, and try the demo to see it in action."
							) }
						</div>
						<Button
							__next40pxDefaultSize
							variant="secondary"
							href="https://woocommerce.com/products/woopayments/"
							target="_blank"
							rel="noopener noreferrer"
							onClick={ () => {
								dispatch(
									recordTracksEvent( 'calypso_a4a_woopayments_explore_woocommerce_button_click' )
								);
							} }
						>
							{ translate( 'Explore WooPayments on WooCommerce.com ↗' ) }
						</Button>
					</>
				</PageSectionColumns.Column>
				<PageSectionColumns.Column alignCenter>
					<img src={ demoImage } alt="WooPayments" />
				</PageSectionColumns.Column>
			</PageSectionColumns>
		</div>
	);
};

export default WooPaymentsDashboardEmptyState;
