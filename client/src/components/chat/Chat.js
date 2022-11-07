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

    const handleSocketChatDice = (msg) => {
        setChatMessages(messages => [...messages, {
            date: msg.date,
            from: msg.from,
            message: `${msg.result} (d${msg.sides})`,
        }]);
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
        socket.on('dice', handleSocketChatDice);
        
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('chat_msg');
            socket.off('dice');
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
    
    const rollDice = (sides) => {
        socket.emit('dice', {
            sides,
        });
    }

    return (
        <div>
            <form onSubmit={handleFormOnSubmit} autoComplete='off'>
                <ul
                    className='block'
                >
                    {
                        chatMessages.map(msg => (
                            <li
                                key={`chat-li-${msg.date}`}
                                className='block'
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
                <div className='block'>
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
                </div>
                <div className='block my-1'>
                    <button 
                        type='button'
                        onClick={() => rollDice(4)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-1'
                    >
                        d4
                    </button>
                    <button 
                        type='button'
                        onClick={() => rollDice(6)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-1'
                    >
                        d6
                    </button>
                    <button 
                        type='button'
                        onClick={() => rollDice(8)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-1'
                    >
                        d8
                    </button>
                    <button 
                        type='button'
                        onClick={() => rollDice(10)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-1'
                    >
                        d10
                    </button>
                    <button 
                        type='button'
                        onClick={() => rollDice(12)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-1'
                    >
                        d12
                    </button>
                    <button 
                        type='button'
                        onClick={() => rollDice(20)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-1'
                    >
                        d20
                    </button>
                    <button 
                        type='button'
                        onClick={() => rollDice(100)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-1'
                    >
                        d100
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Chat;