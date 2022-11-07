import React from 'react';
import io from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SOCKET_PORT = process.env.REACT_APP_SOCKET_PORT;

const socket = io.connect(`${SERVER_URL}:${SOCKET_PORT}`);

const Chat = () => {
    const [isConnected, setIsConnected] = React.useState(socket.connected);
    const [chatMessages, setChatMessages] = React.useState([]);
    const [message, setMessage] = React.useState('');

    const handleSocketChatMsg = (msg) => {
        setChatMessages(messages => [...messages, msg]);
    }

    React.useEffect(() => {
        console.log(`socket: ${SERVER_URL}:${SOCKET_PORT}`);
        socket.on('connect', () => {
        setIsConnected(true);
        });

        socket.on('disconnect', () => {
        setIsConnected(false);
        });

        socket.on('chat_msg', handleSocketChatMsg);
        
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('chat_msg');
        }
    }, []);

    const handleFormOnSubmit = (e) => {
        e.preventDefault();

        console.log(`sent: ${message}`);
        socket.emit('chat_msg', {
            message,
        });
        
        setMessage('');
    }
        
    const handleMessageOnChange = (e) => {
        setMessage(e.target.value);
    }

    return (
        <div>
            <form onSubmit={handleFormOnSubmit} autoComplete='off'>
                <ul>
                    {
                        chatMessages.map(msg => (
                            <li
                                key={`chat-li-${msg.date}`}
                            >
                                <span
                                    className='italic'
                                >
                                    {`${new Date(msg.date).getHours()}:${new Date(msg.date).getMinutes()}`}
                                </span>
                                <span
                                    className='font-bold'
                                >
                                    {` ${msg.from}: `} 
                                </span>
                                <span>
                                    {msg.message}
                                </span>
                            </li>
                        ))
                    }
                </ul>
                <input 
                    type='text'
                    id='message'
                    value={message} 
                    onChange={handleMessageOnChange} 
                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5'    
                />
                <button 
                    type='submit'
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded ml-1'
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default Chat;