import { FC } from 'react';
import Chat from '../types/Chat';

const ChatBubble: FC<Chat> = ({ senderName, createdAt, content }) => {
	return (
		<div>
			<div>
				<span>{senderName}</span>
				<span>{createdAt.toString()}</span>
			</div>
			<div>{content}</div>
		</div>
	);
};

export default ChatBubble;
