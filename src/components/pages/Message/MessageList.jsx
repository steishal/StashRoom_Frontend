import { forwardRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import MessageBubble from './MessageBubble.jsx';

const MessageList = forwardRef(({ messages, currentUserId, onReact }, ref) => (
    <List
        ref={ref}
        height={600}
        itemCount={messages.length}
        itemSize={100}
        width="100%"
    >
        {({ index, style }) => (
            <div style={style}>
                <MessageBubble
                    message={messages[index]}
                    isOwn={messages[index].sender.id === currentUserId}
                    onReact={onReact}
                />
            </div>
        )}
    </List>
));

export default MessageList;
