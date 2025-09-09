### Troubleshooting Log (6 Scenarios)

- **Invite link redirects to localhost:3000 unexpectedly**
  - **Symptom**: Clicking an invitation opens `http://localhost:3000`.
  - **Likely causes**: App URL in the Application set to localhost; email template uses `{{APP_URL}}` pointing to dev; invitation sent from the wrong environment; redirectUrl in the link set to localhost.
  - **Verify**: Inspect the invitation email link target; decode any `redirectUrl` query param; check Applications → App Name → App URL; confirm you’re in the correct environment; review email template variables (Authentication → Emails → Activate user).
  - **Fix**: Update App URL to the intended domain; if using custom email, change template to the correct base URL; re‑send the invite; ensure Allowed Origins include your prod origin.
  - **Prevent/Detect**: Use per‑environment apps/variables; never leave `localhost` in prod; send a test invite in a test environment (like staging) before production.

- **Users page is missing from the Admin Portal**
  - **Symptom**: Admin Portal opens, but Users is not listed.
  - **Likely causes**: Assigned role lacks Users permissions (reproduced); viewing a tenant/environment where the user lacks access; feature toggled off in builder/admin-portal (Workspace → Users) - reproduced.
  - **Verify**: Check the user’s role and policies; inspect role/permissions; confirm the selected tenant.
  - **Fix**: Grant a role with Users read/manage permissions; switch to a tenant where the user has access; re‑login to refresh token.
  - **Prevent/Detect**: Make sure to assign corect roles and config the portal correctly.

- **Invite User button doesn’t appear even after the Users page shows up**
  - **Symptom**: Users page loads, but the Invite control is missing.
  - **Likely causes**: Missing `fe.secure.write.users` permission (reproduced).
  - **Verify**: Check role policy;
  - **Fix**: Add invite permission (and refresh page).
  - **Prevent/Detect**: Check the UI with test user. Perhaps some loggs are possible on dev side.

- **Google login is not available in the login screen**
  - **Symptom**: Google button missing in Hosted Login.
  - **Likely causes**: Google disabled.
  - **Verify**: Check builder/login-box → Social Logins → Google
  - **Fix**: Enable Google (same as verify - activate)
  - **Prevent/Detect**: Stage changes in non‑prod first. Alsways check configs.
  -**Note** There might be deeper issues with. I saw all kinds in the docs, like configs on Google console for example. 
  Also mentions of Configurations → Authentication → Social logins. And some more in this doc https://developers.frontegg.com/guides/authentication/social/google

- **Opening the app yields a 401 during login**
  - **Symptom**: After redirect to the app, API calls fail with 401.
  - **Likely causes**: Access token expired and no refresh in code; something wrong with `baseUrl`; clock mismatch; Cookies or storage issues in browser.
  - **Verify**: Check configs in app and relevant parts of code (example: `keepSessionAlive`); watch the refresh call in Network; check console for storage/cookie warnings; validate Allowed Origins.
  - **Fix**: Use SDK `keepSessionAlive`; correct `REACT_APP_FRONTEGG_BASE_URL` and `clientId`; ensure origin whitelisted; sync time; grant tenant access; retry login.
  - **Prevent/Detect**: Centralize token handling via SDK; monitor 401 rates; add health checks that validate a tokened ping.

- **Access token vs. refresh token (and why a 401 may still happen)**
  - **Access token**: Short‑lived JWT used on API requests (`Authorization: Bearer …`).
  - **Refresh token**: Longer‑lived credential used by the SDK to obtain new access tokens; not sent to your resource APIs.
  - **Refresh process**: When access token expires, SDK exchanges the refresh token at Frontegg for a new access token (silent refresh) and updates session state.
  - **Still 401?**: Refresh token expired/revoked; audience/issuer mismatch; network error during refresh; cookies/storage blocked; user removed from tenant; severe clock skew.

