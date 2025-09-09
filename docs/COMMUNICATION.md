### Customer Email (150–200 words)

Subject: Update: Users page missing & Invite disabled

Hi [Customer Name],

Thanks for flagging that the Users page is missing and Invite is disabled. I reviewed your workspace configuration, recent role changes, and audit logs. Early findings suggest that there was a change to the Admin Portal config. 

I have also checked the policies and logs, and there seem to have been no changes there.

As a temporary workaround, if you have a technical admin with Owner privileges, they can perform invitations via API using an environment token.

I appreciate your patience. We'll follow up in 30-60 minutes after the issue is fixed, with the actions taken. 
We'll also check the audits to find the actions that caused this and report back to you, so that can be prevented in the future.

Best regards,
Lily Stone,
Technical Support,
Frontegg

---

**Note**: I have assumed that since it is a single costumer, this is not a system issue on our side. I would still check, but not inform the user, if the issue is not on our side (at least most likely).

### Runbook: Login failed (401) after redirect

1) Validate env: `REACT_APP_FRONTEGG_BASE_URL` and `REACT_APP_FRONTEGG_CLIENT_ID` match the workspace.
2) Browser Network tab: observe the login redirect, callback, token and refresh requests; note any 4xx and response bodies.
3) Browser Console: errors/warnings about cookies, storage, CORS, or time skew.
4) Frontegg console: Allowed Origins and App/Redirect URLs include the app origin; protocol/port exact.
5) Token sanity : DevTools → Network → pick a post‑login request → copy Authorization: Bearer token. Decode at jwt.io (or Console: `JSON.parse(atob(token.split('.') [1]))`). Verify `iss`, `aud`, `exp`, and `tenantId`. Never paste tokens into tickets; share via secure channel only.
6) Session settings: confirm cookies/storage allowed; SameSite/third‑party cookie settings not blocking.
7) Access checks: user is active and a member of the target tenant; try a known‑good admin user.
8) Client retry: clear cache, open private window, and retry; ensure SDK `keepSessionAlive` is enabled.
9) Time sync: ensure system clock is within a few seconds; retry.
10) Still failing: capture HAR (with content), note timestamps, userId, tenantId, app URL, browser/SDK versions, and escalate per procedure.

---

### Prioritization (Magic Link incident, 3 enterprise tickets >24 hours, new feature for demo)

- Declare a P1 incident for Magic Link (about 5% of tenants). I will act as the Incident Lead, open an incident channel, ask to pause risky deployments, and commit to status updates every 30 minutes. Involve Devs, QA, Project and Product managers. 
- Customer communication: coordinate with Customer Success Managers and Support to notify affected tenants with scope, a temporary workaround (alternate login), and the time of the next update; also update the public status page. (Mostly delegated to support enginers if possible, so I can concentrate on managing the issue and resolution internally)
- Drive the fix: Follow up with the relevant parties fixing the issue (if needed, asssit with any sort of investigation and support with information - But also, let them concentrate on their job).
- After mitigation: re‑triage the three enterprise tickets older than 24 hours. A senior support engineer will contact each customer, confirm the service‑level agreement, and provide a clear plan and an estimated resolution time today. (Could be done in parrallel with previous steps, if enough people available from Tech Support side, since no need for too many people for previous step).
- Manage the feature request: acknowledge Sales and partner with the Product Manager and engineering to size the request. Prepare demo data and scripts asynchronously. Do not schedule work that would delay incident recovery or risk breaching enterprise service‑level agreements.
- Close the loop: after the incident is resolved, run a short post‑incident review with all the relvant parties (Support, Devs, Product managers and QA). Publish action items.