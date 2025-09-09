import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FronteggProvider } from '@frontegg/react';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const contextOptions = {
  baseUrl: process.env.REACT_APP_FRONTEGG_BASE_URL as string,
  clientId: process.env.REACT_APP_FRONTEGG_CLIENT_ID as string,
};

root.render(
  <React.StrictMode>
    <FronteggProvider
      contextOptions={contextOptions}
      hostedLoginBox={true}
      authOptions={{ keepSessionAlive: true }}
    >
      <App />
    </FronteggProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
