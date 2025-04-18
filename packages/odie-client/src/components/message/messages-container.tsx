import { HelpCenterSelect } from '@automattic/data-stores';
import { useResetSupportInteraction } from '@automattic/help-center/src/hooks/use-reset-support-interaction';
import { HELP_CENTER_STORE } from '@automattic/help-center/src/stores';
import { getShortDateString } from '@automattic/i18n-utils';
import { Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useRef, useState } from 'react';
import { NavigationType, useNavigationType, useSearchParams } from 'react-router-dom';
import { useOdieAssistantContext } from '../../context';
import {
	useAutoScroll,
	useCreateZendeskConversation,
	useZendeskMessageListener,
	useUpdateDocumentTitle,
} from '../../hooks';
import { useHelpCenterChatScroll } from '../../hooks/use-help-center-chat-scroll';
import {
	getOdieInitialMessage,
	interactionHasZendeskEvent,
	interactionHasEnded,
} from '../../utils';
import { ViewMostRecentOpenConversationNotice } from '../odie-notice/view-most-recent-conversation-notice';
import { DislikeFeedbackMessage } from './dislike-feedback-message';
import { JumpToRecent } from './jump-to-recent';
import { ThinkingPlaceholder } from './thinking-placeholder';
import ChatMessage from '.';
import type { Chat, CurrentUser } from '../../types';

const LoadingChatSpinner = () => {
	return (
		<div className="chatbox-loading-chat__spinner">
			<Spinner />
		</div>
	);
};

const ChatDate = ( { chat }: { chat: Chat } ) => {
	// chat.messages[ 1 ] contains the first user interaction, therefore the date, otherwise the current date.
	const chatDate =
		chat.messages.length > 1 ? chat.messages[ 1 ]?.created_at || Date.now() : Date.now();
	const currentDate = getShortDateString( chatDate as number );
	return <div className="odie-chat__date">{ currentDate }</div>;
};

interface ChatMessagesProps {
	currentUser: CurrentUser;
}

export const MessagesContainer = ( { currentUser }: ChatMessagesProps ) => {
	const { chat, botNameSlug, isChatLoaded, isUserEligibleForPaidSupport } =
		useOdieAssistantContext();
	const createZendeskConversation = useCreateZendeskConversation();
	const resetSupportInteraction = useResetSupportInteraction();
	const [ searchParams, setSearchParams ] = useSearchParams();
	const isForwardingToZendesk =
		searchParams.get( 'provider' ) === 'zendesk' && chat.provider !== 'zendesk';
	const [ hasForwardedToZendesk, setHasForwardedToZendesk ] = useState( false );
	const [ chatMessagesLoaded, setChatMessagesLoaded ] = useState( false );
	const [ shouldEnableAutoScroll, setShouldEnableAutoScroll ] = useState( true );
	const navType: NavigationType = useNavigationType();

	const messagesContainerRef = useRef< HTMLDivElement >( null );
	const scrollParentRef = useRef< HTMLElement | null >( null );

	const { alreadyHasActiveZendeskChat, chatHasEnded } = useSelect( ( select ) => {
		const helpCenterSelect: HelpCenterSelect = select( HELP_CENTER_STORE );
		const currentInteraction = helpCenterSelect.getCurrentSupportInteraction();
		return {
			alreadyHasActiveZendeskChat:
				interactionHasZendeskEvent( currentInteraction ) &&
				! interactionHasEnded( currentInteraction ),
			chatHasEnded: interactionHasEnded( currentInteraction ),
		};
	}, [] );

	useZendeskMessageListener();
	useAutoScroll( messagesContainerRef, shouldEnableAutoScroll );
	useHelpCenterChatScroll( chat?.supportInteractionId, scrollParentRef, ! shouldEnableAutoScroll );

	useEffect( () => {
		if ( navType === 'POP' && ( isChatLoaded || ! isUserEligibleForPaidSupport ) ) {
			setShouldEnableAutoScroll( false );
		}
	}, [ navType, isUserEligibleForPaidSupport, shouldEnableAutoScroll, isChatLoaded ] );

	useEffect( () => {
		if ( messagesContainerRef.current && scrollParentRef.current === null ) {
			scrollParentRef.current = messagesContainerRef.current?.closest(
				'.help-center__container-content'
			);
		}
	}, [ messagesContainerRef ] );
	useUpdateDocumentTitle();

	// prevent zd transfer for non-eligible users
	useEffect( () => {
		if ( isForwardingToZendesk && ! isUserEligibleForPaidSupport ) {
			searchParams.delete( 'provider' );
			setChatMessagesLoaded( true );
		}
	}, [ isForwardingToZendesk, isUserEligibleForPaidSupport, setChatMessagesLoaded ] );

	useEffect( () => {
		if ( isForwardingToZendesk || hasForwardedToZendesk ) {
			return;
		}

		( chat?.status === 'loaded' || chat?.status === 'closed' ) && setChatMessagesLoaded( true );
	}, [ chat?.status, isForwardingToZendesk, hasForwardedToZendesk ] );

	/**
	 * Handle the case where we are forwarding to Zendesk.
	 */
	useEffect( () => {
		if (
			isForwardingToZendesk &&
			! hasForwardedToZendesk &&
			! chat.conversationId &&
			createZendeskConversation &&
			resetSupportInteraction &&
			isChatLoaded
		) {
			searchParams.delete( 'provider' );
			searchParams.set( 'direct-zd-chat', '1' );
			setSearchParams( searchParams );
			setHasForwardedToZendesk( true );

			// when forwarding to zd avoid creating new chats
			if ( alreadyHasActiveZendeskChat ) {
				setChatMessagesLoaded( true );
			} else {
				resetSupportInteraction().then( ( interaction ) => {
					if ( isChatLoaded ) {
						createZendeskConversation( {
							avoidTransfer: true,
							interactionId: interaction?.uuid,
							section: searchParams.get( 'section' ),
							createdFrom: 'direct_url',
						} ).then( () => {
							setChatMessagesLoaded( true );
						} );
					}
				} );
			}
		}
	}, [
		isForwardingToZendesk,
		hasForwardedToZendesk,
		isChatLoaded,
		chat?.conversationId,
		resetSupportInteraction,
		createZendeskConversation,
		alreadyHasActiveZendeskChat,
	] );

	// Used to apply the correct styling on messages
	const isNextMessageFromSameSender = ( currentMessage: string, nextMessage: string ) => {
		return currentMessage === nextMessage;
	};

	const availableStatusWithFeedback = [ 'sending', 'transfer' ];

	return (
		<>
			<div className="chatbox-messages" ref={ messagesContainerRef }>
				<ChatDate chat={ chat } />
				{ ! chatMessagesLoaded ? (
					<LoadingChatSpinner />
				) : (
					<>
						{ ( chat.odieId || chat.provider === 'odie' ) && (
							<ChatMessage
								message={ getOdieInitialMessage( botNameSlug ) }
								key={ 0 }
								currentUser={ currentUser }
								isNextMessageFromSameSender={ false }
								displayChatWithSupportLabel={ false }
							/>
						) }
						{ chat.messages.map( ( message, index ) => {
							const nextMessage = chat.messages[ index + 1 ];
							const displayChatWithSupportLabel =
								! nextMessage?.context?.flags?.show_contact_support_msg &&
								message.context?.flags?.show_contact_support_msg &&
								! chatHasEnded;

							const displayChatWithSupportEndedLabel = ! nextMessage && chatHasEnded;

							return (
								<ChatMessage
									message={ message }
									key={ index }
									currentUser={ currentUser }
									isNextMessageFromSameSender={ isNextMessageFromSameSender(
										message.role,
										chat.messages[ index + 1 ]?.role
									) }
									displayChatWithSupportLabel={ displayChatWithSupportLabel }
									displayChatWithSupportEndedLabel={ displayChatWithSupportEndedLabel }
								/>
							);
						} ) }
						<JumpToRecent containerReference={ messagesContainerRef } />
						{ chat.provider === 'odie' && (
							<>
								<ViewMostRecentOpenConversationNotice />
								{ availableStatusWithFeedback.includes( chat.status ) && (
									<div className="odie-chatbox__action-message">
										{ chat.status === 'sending' && <ThinkingPlaceholder /> }
										{ chat.status === 'dislike' && <DislikeFeedbackMessage /> }
									</div>
								) }
							</>
						) }
					</>
				) }
			</div>
		</>
	);
};
