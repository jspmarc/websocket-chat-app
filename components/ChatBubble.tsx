import { FC } from 'react';
import Chat from '../types/Chat';

const ChatBubble: FC<Chat & { fromSender: boolean }> = ({ senderName, createdAt, content, fromSender }) => {
	return (
		<div className='grid grid-cols-1 grid-rows-2 mb-4'>
			<div className='col-span-3'>
				{senderName}&nbsp;&nbsp;({createdAt.toString()})
			</div>
			<div className='font-bold'>{content}</div>
		</div>
	);
};

export default ChatBubble;
