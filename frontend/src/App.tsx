import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { AdminPortal, useAuth, useAuthActions, useLoginWithRedirect, useTenantsActions } from '@frontegg/react';
import { ContextHolder } from '@frontegg/rest-api';

function App() {
  const { user, isAuthenticated, isLoading, tenantsState }: any = useAuth();
  const { logout, switchTenant } = useAuthActions();
  const loginWithRedirect = useLoginWithRedirect();
  const { loadTenants } = useTenantsActions();
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(undefined);
  const tenantIds: string[] = (user?.tenantIds as string[] | undefined) ?? [];
  const tenants: any[] = useMemo(() => (tenantsState?.tenants as any[]) ?? [], [tenantsState?.tenants]);
  const tenantNameById = useMemo(
    () =>
      new Map<string, string>(
        tenants.map((t: any) => [t?.tenantId ?? t?.id, t?.name ?? t?.tenantName ?? (t?.metadata?.name as string) ?? (t?.tenantId ?? t?.id)])
      ),
    [tenants]
  );
  const [tenantNameCache, setTenantNameCache] = useState<Record<string, string>>({});
  const currentTenantName = tenantNameCache[user?.tenantId as string] ?? tenantNameById.get(user?.tenantId as string) ?? user?.tenantId;
  const activeTenantId = (user?.tenantId as string | undefined) ?? '';
  const selectValue = (selectedTenantId ?? activeTenantId) as string;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ redirectUrl: window.location.href });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTenants();
    }
  }, [isAuthenticated, loadTenants]);

  useEffect(() => {
    if (tenants.length > 0) {
      setTenantNameCache((prev) => {
        const next = { ...prev };
        tenants.forEach((t: any) => {
          const id = t?.tenantId ?? t?.id;
          const name = t?.name ?? t?.tenantName ?? (t?.metadata?.name as string) ?? id;
          if (id && name) {
            next[id] = name as string;
          }
        });
        return next;
      });
    }
  }, [tenants]);

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
        {tenantIds.length >= 1 ? (
          <div style={{ marginTop: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Active tenant:</strong> {currentTenantName}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
              <select
                value={selectValue}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                className="select"
                disabled={tenantIds.length < 2}
              >
                {selectValue === '' ? (
                  <option value="" disabled>
                    Select tenant
                  </option>
                ) : null}
                {tenantIds.map((tid: string) => {
                  const label = tenantNameCache[tid] ?? tenantNameById.get(tid) ?? tid;
                  return (
                    <option key={tid} value={tid}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <button
                className="btn"
                disabled={tenantIds.length < 2 || !selectedTenantId || selectedTenantId === user?.tenantId}
                onClick={() => {
                  if (selectedTenantId) {
                    const label = tenantNameById.get(selectedTenantId) ?? selectedTenantId;
                    setTenantNameCache((prev) => ({ ...prev, [selectedTenantId]: label }));
                    switchTenant({ tenantId: selectedTenantId, silentReload: true });
                    setSelectedTenantId(undefined);
                  }
                }}
              >
                Switch tenant
              </button>
            </div>
          </div>
        ) : null}
        <div className="actions">
          <button className="btn" onClick={() => AdminPortal.show()}>
            Open Admin Portal
          </button>
          <button className="btn"
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
