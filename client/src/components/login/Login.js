import React from 'react';
import axios from 'axios';
import { UserContext } from '../../App';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const REST_PORT = process.env.REACT_APP_REST_PORT;

const Login = () => {
    const [show, setShow] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [user, setUser] = React.useContext(UserContext);

    const onFormSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post(`${SERVER_URL}:${REST_PORT}/api/auth`, {email,password});
        
        if (response.status !== 200) {
            return;
        }

        setUser(response.data);
        setShow(false);
    }
    
    if (user && user.token) {
        return (
            <div>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded ml-1'
                    onClick={() => {
                        setUser(null);
                    }}
                    type='button'
                >
                    Logout
                </button>
            </div>
        )
    }

    if (!show) {
        return (
            <div>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded ml-1'
                    onClick={() => setShow(true)}
                    type='button'
                >
                    Login
                </button>
            </div>
        )
    }

    return (
        <div>
            <button
                className='bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded ml-1'
                onClick={() => setShow(false)}
                type='button'
            >
                Hide
            </button>
            <form onSubmit={onFormSubmit}>
                <div className='block'>
                    <label htmlFor='email' className='mr-2'>Email</label>
                    <input
                        id='email'
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5'    
                    />
                </div>
                <div className='block'>
                    <label htmlFor='password' className='mr-2'>Password</label>
                    <input
                        id='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5'    
                    />
                </div>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded ml-1'
                    type='submit'
                >
                   Login 
                </button>
            </form>
        </div>
    )
}

export default Login;