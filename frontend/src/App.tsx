import React, { useEffect } from 'react';
import './App.css';
import { AdminPortal, useAuth, useAuthActions, useLoginWithRedirect } from '@frontegg/react';
import { ContextHolder } from '@frontegg/rest-api';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { logout } = useAuthActions();
  const loginWithRedirect = useLoginWithRedirect();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ redirectUrl: window.location.href });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Loading authentication...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {user?.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={user?.name || user?.email || 'User'}
            style={{ width: 80, height: 80, borderRadius: '50%' }}
          />
        ) : null}
        <h2>Welcome{user?.name ? `, ${user.name}` : ''}!</h2>
        <p>{user?.email}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button onClick={() => AdminPortal.show()}>Open Admin Portal</button>
          <button
            onClick={() => {
              const baseUrl = ContextHolder.getContext().baseUrl;
              // Ensure user lands back in the app after logout
              const postLogout = window.location.origin;
              logout().finally(() => {
                window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${encodeURIComponent(postLogout)}`;
              });
            }}
          >
            Logout
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
