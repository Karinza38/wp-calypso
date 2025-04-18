import { details } from '@wordpress/icons';
import { useTranslate } from 'i18n-calypso';
import { useMemo } from 'react';
import { LogType, ServerLog, PHPLog } from 'calypso/data/hosting/use-site-logs-query';
import { useDispatch } from 'calypso/state';
import { successNotice, errorNotice } from 'calypso/state/notices/actions';
import DetailsModalPHP from '../components/details-modal-php';
import DetailsModalServer from '../components/details-modal-server';

const useActions = ( { logType, isLoading }: { logType: LogType; isLoading: boolean } ) => {
	const translate = useTranslate();
	const dispatch = useDispatch();

	const actions = useMemo( () => {
		if ( logType === LogType.PHP ) {
			return [
				{
					id: 'details-modal',
					label: translate( 'View log details' ),
					modalHeader: translate( 'Log details' ),
					isPrimary: true,
					icon: details,
					disabled: isLoading,
					supportsBulk: false,
					RenderModal: ( { items }: { items: ( PHPLog | ServerLog )[] } ) => {
						const item = items[ 0 ] as PHPLog;
						return <DetailsModalPHP item={ item } />;
					},
				},
				{
					id: 'copy-msg',
					label: translate( 'Copy message' ),
					disabled: isLoading,
					supportsBulk: false,
					callback: async ( items: ( PHPLog | ServerLog )[] ) => {
						const message = ( items[ 0 ] as PHPLog ).message;
						try {
							await navigator.clipboard.writeText( message );
							dispatch(
								successNotice(
									/* translators: notice shown upon copy of Logs entry */
									translate( 'Copied message' )
								)
							);
						} catch ( error ) {
							dispatch(
								errorNotice(
									/* translators: notice shown upon failed copy of Logs entry */
									translate( 'Message could not be copied' )
								)
							);
						}
					},
				},
			];
		}

		return [
			{
				id: 'details-modal',
				label: translate( 'View log details' ),
				modalHeader: translate( 'Log details' ),
				isPrimary: true,
				icon: details,
				disabled: isLoading,
				supportsBulk: false,
				RenderModal: ( { items }: { items: ( PHPLog | ServerLog )[] } ) => {
					const item = items[ 0 ] as ServerLog;
					return <DetailsModalServer item={ item } />;
				},
			},
			{
				id: 'copy-url',
				label: translate( 'Copy request URL' ),
				disabled: isLoading,
				supportsBulk: false,
				callback: async ( items: ( PHPLog | ServerLog )[] ) => {
					const url = ( items[ 0 ] as ServerLog ).request_url;
					try {
						await navigator.clipboard.writeText( url );
						dispatch(
							successNotice(
								/* translators: notice shown upon copy of request URL */
								translate( 'Copied request URL' )
							)
						);
					} catch ( error ) {
						dispatch(
							errorNotice(
								/* translators: notice shown upon failed copy of request URL */
								translate( 'Request URL could not be copied' )
							)
						);
					}
				},
			},
		];
	}, [ logType, translate, isLoading, dispatch ] );

	return actions;
};

export default useActions;
