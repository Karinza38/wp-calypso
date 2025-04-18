import { HelpCenterSelect } from '@automattic/data-stores';
import { HELP_CENTER_STORE } from '@automattic/help-center/src/stores';
import { useSelect } from '@wordpress/data';
import Smooch from 'smooch';
import { useOdieAssistantContext } from '../context';
import { getConversationIdFromInteraction } from '../utils';
import { useCreateZendeskConversation } from './use-create-zendesk-conversation';
import type { Message } from '../types';

/**
 * Send a message to the Zendesk conversation.
 */
export const useSendZendeskMessage = () => {
	const currentConversationId = useSelect( ( select ) => {
		const store = select( HELP_CENTER_STORE ) as HelpCenterSelect;
		const currentSupportInteraction = store.getCurrentSupportInteraction();

		return getConversationIdFromInteraction( currentSupportInteraction );
	}, [] );

	const { setChatStatus, chat } = useOdieAssistantContext();
	const newConversation = useCreateZendeskConversation();

	const conversationId = currentConversationId || chat.conversationId;
	return async ( message: Message ) => {
		setChatStatus( 'sending' );

		if ( ! conversationId ) {
			// Start a new conversation if it doesn't exist
			await newConversation( { createdFrom: 'send_zendesk_message' } );
			setChatStatus( 'loaded' );
			return;
		}

		await Smooch.sendMessage( { type: 'text', text: message.content }, conversationId );
		setChatStatus( 'loaded' );
	};
};
