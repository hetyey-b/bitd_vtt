import React from 'react';
import {CircularProgressBar} from 'react-circular-progressbar';
import axios from 'axios';
import io from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SOCKET_PORT = process.env.REACT_APP_SOCKET_PORT;

const socket = io.connect(`${SERVER_URL}:${SOCKET_PORT}`);

const Clocks = () => {
    const [clocks, setClocks] = React.useState([]);

    const handleSocketClocks = (msg) => {
        setClocks(clocks => [...clocks, msg]);
    }

    React.useEffect(() => {
        socket.on('clocks', handleSocketClocks);

        return () => {
            socket.off('clocks');
        }
    }, []);
    
    return(
        <div>
            Clocks
        </div>
    )
}

export default Clocks;