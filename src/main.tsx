import React from 'react'
import ReactDOM from 'react-dom/client'
import RoutesMeeting5 from './routes/RoutesMeeting5'
import './index.css';
import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RoutesMeeting5/>
    </UserProvider>
  </React.StrictMode>,
)
