### Part C: API & SDK Tasks

#### 1) Change a user's active tenant (API)

- **Endpoint (change for self)**: `PUT /identity/resources/users/v1/tenant`
  - Base URL: `https://api.frontegg.com`
  - Regions: `https://api.us.frontegg.com/identity/`, `https://api.ca.frontegg.com/identity/`, etc.
  - **Auth**: User JWT.
```bash
curl -X PUT \
  "https://api.frontegg.com/identity/resources/users/v1/tenant" \
  -H "Authorization: Bearer ${USER_JWT}" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "'"${TENANT_ID}"'"
  }'
```

- **Endpoint (admin/vendor change for another user)**: `PUT /identity/resources/users/v1/tenant`
  - **Auth**: Environment token
  - **Headers**: `frontegg-user-id: <USER_ID>`
```bash
curl -X PUT \
  "https://api.frontegg.com/identity/resources/users/v1/tenant" \
  -H "Authorization: Bearer ${ENVIRONMENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "frontegg-user-id: ${USER_ID}" \
  -d '{
    "tenantId": "'"${TENANT_ID}"'",
    "validateTenantExist": true
  }'
```
Reference: [Set user's account (tenant) – vendor/admin](https://developers.frontegg.com/api/identity/users/userscontrollerv1_updateusertenantforvendor)

- **Alternative**: `PATCH /identity/resources/users/v1/{userId}`
  - Body: `{ "activeTenantId": "<TENANT_ID>" }`
```bash
curl -X PATCH \
  "https://api.frontegg.com/identity/resources/users/v1/${USER_ID}" \
  -H "Authorization: Bearer ${ENVIRONMENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "activeTenantId": "'"${TENANT_ID}"'"
  }'
```

Reference: [Frontegg API – Update user's active account (tenant)](https://developers.frontegg.com/api/identity/user-management/userscontrollerv1_updateusertenant)

- **When used in support**: User is moved to a new tenant (org change/migration) and needs their active tenant switched immediately to avoid 403s and to see the correct data after login.

#### 2) Bonus — Change active tenant via SDK

- **React SDK**: switch the active tenant for the current session using actions.
```tsx
import { useAuth, useAuthActions } from '@frontegg/react';

function SwitchTenantButton({ tenantId }: { tenantId: string }) {
  const { switchTenant } = useAuthActions();
  const { user } = useAuth(); // user.tenantIds lists memberships
  return (
    <button onClick={() => switchTenant({ tenantId /* , silentReload: true */ })}>
      Switch
    </button>
  );
}
```
- **Notes**: `silentReload` is supported in recent versions (we use `@frontegg/react@^7.12.3`, which qualifies). SDK doc: [Tenant methods](https://developers.frontegg.com/sdks/components/tenant-functions)
- **Caveats**: Only affects the logged-in session; user must have access to the target tenant. Per‑application switching also exists and is separate: [Switch users active account (tenant) in applications](https://developers.frontegg.com/api/identity/users-applications-management/applicationsactiveusertenantscontrollerv1_switchuserapplicationactivetenant)

#### 3) Block sign-ups for a certain email domain

- **Policies/Config**: In Keys & Domains → Domains → Account sign-up restrictions → Deny Only → added domain (hotmail.com). 
- **Note**: Not blocking invites. Only direct sign ups, with error:
```json
{
  "errors": [
    "Sorry, you can't sign up. Please contact an admin for help."
  ],
  "errorCode": "ER-01183"
}
```

- **Hook (pre‑sign‑up) approach**
```js
// Pseudo-code for a serverless pre-signup hook
export async function handler(event) {
  const email = event?.user?.email || '';
  const blocked = ['hotmail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  if (blocked.includes(domain)) {
    return { allow: false, statusCode: 400, message: 'Sign-ups from this domain are not allowed.' };
  }
  return { allow: true };
}
```

- **Test**: Attempt sign-up with allowed vs blocked domains; verify behavior and error message.
- **Monitor**: Track audit logs and add alerts on repeated blocked attempts; dashboard rejection rates. Easiest visual audit logs from the Backoffice/Admin Portal.

  Example (CSV): (IP encoded)
  ```csv
  Time,User Agent,IP Address,User (email),Action,Description,Severity
  2025-09-09T10:05:51.651Z,Mozilla/5.0...,xx.xxx.xxx.xx,,Email domain restricted,Email domain restricted - test@hotmail.com,Info
  ```