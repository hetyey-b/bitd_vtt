import React from 'react';
import Chat from './components/chat/Chat';
import Clocks from './components/clock/Clocks';
import Login from './components/login/Login';

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = React.useState(null);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className='flex justify-between mx-5 mt-1'>
        <div>
          <Login />
          <Clocks />
        </div>
        <div>
          <Chat />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
