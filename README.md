### Frontegg Technical Support Assignment

This repo contains a minimal React app integrated with Frontegg for authentication and the Admin Portal (Part A), plus supporting docs for Parts B–D.

#### Project layout

- `frontend/`: React app with Frontegg integration
- `docs/TROUBLESHOOTING.md`: Part B scenarios
- `docs/API_SDK.md`: Part C answers and examples
- `docs/COMMUNICATION.md`: Part D deliverables

#### Prerequisites

- Node 18+
- A Frontegg workspace with domain and clientId

#### Setup

1) Create env file in `frontend/`:

```bash
cd frontend
cp env.local.example .env.local
# Set values:
# REACT_APP_FRONTEGG_BASE_URL=https://app-<your-id>.frontegg.com
# REACT_APP_FRONTEGG_CLIENT_ID=<your-client-id>
```

2) Install and run:

```bash
npm install
npm start
```

The app starts at `http://localhost:3000`.

#### Frontegg configuration (Access Control, Roles & Policies)

- Authentication methods: Enable Magic Link only;.
- Redirects/Origins: Add `http://localhost:3000`.

#### What worked / what didn’t

- Worked: Hosted Login + Magic Link, displaying user profile, opening Admin Portal, token refresh via `keepSessionAlive`.
- Not exactly worked: No specific permissions for Invite (only) Or for M2M tokens (only). That I could find. At least without manual tests in the code - so added what I though was most reelvant, to also show it in the Admin Portal for the Limited User. 

#### Deliverables

- Troubleshooting log: see `docs/TROUBLESHOOTING.md`.
- API & SDK tasks: see `docs/API_SDK.md`.
- Communication & Leadership: see `docs/COMMUNICATION.md`.

#### Stretch goals implemented

- Tenant switcher UI: if a user belongs to multiple tenants, a selector appears that lists their `tenantIds`. Choosing a tenant calls `switchTenant({ tenantId, silentReload: true })` to change context.
- Deployed https://frontegg.vercel.app/
