# AGLETRAS — Custom Private Inquiry Email System Report

## 1. Executive Summary
A custom, private, serverless inquiry delivery system has been engineered for **Agletras Intelligence** (`D:\New folder (2)\Agletras-Rebuild`). 

This implementation completely eliminates third-party form processors (FormSubmit, Google Forms, EmailJS, Formspree), preventing tracking, external redirects, and unencrypted intermediary storage. Inquiries are dispatched directly to `info.agletras@gmail.com` via a private **Cloudflare Worker** serverless relay authenticated against the official **Google Gmail REST API (v1)** using OAuth 2.0.

Delivery is never claimed until the official Gmail API confirms message acceptance with a cryptographic message ID.

---

## 2. Architecture & Data Flow

```
Visitor Browser (Astro Frontend)
       │
       ▼ (Client Pre-validation: regex, required fields, honeypot)
  POST /api/inquiry (JSON payload)
       │
       ▼
Private Serverless Relay (Cloudflare Worker / Pages Function)
  ├── 1. CORS Origin Verification
  ├── 2. Sliding-Window Rate Limiting (5 requests / 10 min / IP)
  ├── 3. Honeypot Check (_honey -> silent drop)
  ├── 4. CR/LF Header Injection Stripping & HTML Escaping
  ├── 5. Ephemeral Token Refresh via Google OAuth 2.0
  ├── 6. RFC 2822 MIME Assembly (Reply-To: visitor, Agletras Branded HTML)
  └── 7. Base64URL Encoding & Dispatch
       │
       ▼ POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send
Official Google Gmail API (v1)
       │
       ▼ (Returns HTTP 200 { id: "msg_id", threadId: "..." })
Delivery Confirmed to info.agletras@gmail.com
       │
       ▼ (Worker returns HTTP 200 { success: true, messageId: "msg_id" })
Frontend displays TRANSMISSION CONFIRMED -> Routes to /contact/thank-you
```

---

## 3. Frontend Implementation ([`src/pages/contact.astro`](../src/pages/contact.astro))

### Form Fields Preserved
All four canonical inquiry fields and Agletras CRT/telemetry aesthetics are strictly preserved:
1. `organization`: Organization / Counterparty Name
2. `email`: Authorized Representative Email
3. `inquiry_focus`: Research Inquiry Focus (validated dropdown)
4. `research_objective`: Target Anchors & Scoping Objective (textarea)
5. `_honey`: Hidden honeypot field (`display: none;`, `tabindex="-1"`)

### Removal of Third-Party Dependencies
- Purged all FormSubmit endpoints, hidden inputs (`_subject`, `_template`, `_captcha`), and activation notices.
- Purged `https://formsubmit.co` from the Content Security Policy in [`public/_headers`](../public/_headers).
- Replaced with direct post to `/api/inquiry` (or configurable via `PUBLIC_INQUIRY_ENDPOINT`).

### Dispatch States & Truth in Delivery
- **Pre-validation**: Form validation checks missing fields and email regex before any network call.
- **Transmitting State**: The submit button is disabled (`is-loading`), displaying `DISPATCHING TO PRIVATE GATEWAY...`. Telemetry status displays `DISPATCH IN PROGRESS: Connecting to private serverless relay. Awaiting official Gmail API delivery confirmation...`.
- **Verified Delivery Only**: Only when the backend returns HTTP 200 with `{ success: true, messageId: ... }` does the UI confirm dispatch (`TRANSMISSION CONFIRMED`) and redirect to `/contact/thank-you`.
- **Failure Handling**: If the relay or Gmail API fails, the button is re-enabled, an unconfirmed warning states: **"Your inquiry has NOT been confirmed as sent."**, and a fallback `mailto:info.agletras@gmail.com` link is generated with all inputs pre-populated.

---

## 4. Backend Implementation (Cloudflare Worker & Pages Function)

### Code Structure
```
D:\New folder (2)\Agletras-Rebuild\
├── functions\
│   └── api\
│       └── inquiry.ts             # Cloudflare Pages Function same-origin adapter
└── worker\
    ├── package.json               # Worker manifest
    ├── tsconfig.json              # TypeScript worker configuration
    ├── wrangler.toml              # Cloudflare Worker configuration & vars
    ├── src\
    │   ├── types.ts               # Payload, environment, and validation interfaces
    │   ├── security.ts            # Rate limiting, honeypot, sanitization, CORS
    │   ├── email-template.ts      # Branded HTML dossier & plain-text templates
    │   ├── gmail.ts               # Google OAuth refresher, RFC 2822 MIME builder, Gmail API dispatcher
    │   └── index.ts               # Main HTTP request handler (OPTIONS, POST /api/inquiry)
    └── tests\
        └── worker.test.mjs        # Automated unit test suite (15 passing tests)
```

### Security & Sanitization Protocols
- **CORS Protection**: Restricted to verified origins (`https://agletras.com`, `https://www.agletras.com`, `https://hrudyanshkayastha.github.io`, `https://agletras-intelligence.pages.dev`, localhost in dev). Preflight `OPTIONS` returns 204.
- **Rate Limiting**: In-memory sliding window rate limiter permits maximum 5 submissions per 10 minutes per IP address. Exceeded requests return HTTP 429 with `Retry-After: 600`.
- **Honeypot Spam Trap**: If `_honey` contains any data, the Worker returns a silent HTTP 200 success response, preventing bots from retrying while discarding the transmission without calling Gmail API.
- **Header Injection Shield**: Strips `\r`, `\n`, and control characters from `organization`, `email`, and `inquiry_focus` to prevent RFC 2822 header injection.
- **XSS & HTML Escaping**: HTML entity-encodes `<`, `>`, `&`, `"`, `'` in all message fields before rendering the email body.
- **Zero Data Retention**: The Worker operates statelessly in memory; no message contents or email addresses are stored in KV, databases, or third-party loggers.

---

## 5. Branded HTML Email Template ([`worker/src/email-template.ts`](../worker/src/email-template.ts))

The generated email adheres to Agletras's dark emerald visual identity:
- **Palette**: Deep void (`#030608`), emerald borders (`rgba(16, 185, 129, 0.25)`), electric jade accents (`#10B981`), high-contrast headings (`#FFFFFF`), slate secondary text (`#94A3B8`).
- **Subject**: `New Agletras Research Inquiry — <Organization Name>`
- **Headers**:
  - `From: "Agletras Research Intake" <info.agletras@gmail.com>`
  - `To: <info.agletras@gmail.com>`
  - `Reply-To: "<Organization>" <visitor@domain.com>`
- **Telemetry Footer**: Includes UTC dispatch timestamp, transport verification (`Google Gmail API v1`), and mutual NDA legal confidentiality notice.

---

## 6. Step-by-Step Gmail API & Cloudflare Setup Guide

To activate the system in production, follow these steps:

### Part A: Google Cloud Console (Gmail API & OAuth Credentials)
1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create or select a project (e.g. `agletras-intelligence-gateway`).
2. Navigate to **APIs & Services > Library**, search for **Gmail API**, and click **Enable**.
3. Navigate to **APIs & Services > OAuth consent screen**:
   - User Type: **External**
   - App Name: `Agletras Research Gateway`
   - User Support & Developer Contact Email: `info.agletras@gmail.com`
   - Scopes: Add `https://www.googleapis.com/auth/gmail.send`
   - Test Users: Add `info.agletras@gmail.com`
4. Navigate to **APIs & Services > Credentials > Create Credentials > OAuth client ID**:
   - Application type: **Web application** (or **Desktop app**)
   - Name: `Agletras Cloudflare Worker`
   - Authorized redirect URIs: `https://developers.google.com/oauthplayground` (for token generation)
   - Save your **Client ID** and **Client Secret**.
5. Generate the one-time **Refresh Token**:
   - Open [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
   - Click the gear icon in the top right:
     - Check **Use your own OAuth credentials**
     - Enter your **OAuth Client ID** and **OAuth Client Secret**
   - In Step 1 (Select & authorize APIs), enter: `https://www.googleapis.com/auth/gmail.send`
   - Click **Authorize APIs** and log in with `info.agletras@gmail.com`.
   - In Step 2, click **Exchange authorization code for tokens**.
   - Copy the generated `refresh_token`.

### Part B: Cloudflare Deployment & Secret Configuration
1. Open a terminal in `D:\New folder (2)\Agletras-Rebuild\worker`.
2. Deploy the secrets to Cloudflare (never commit these to Git):
   ```bash
   npx wrangler secret put GMAIL_CLIENT_ID
   # Paste Google Client ID when prompted

   npx wrangler secret put GMAIL_CLIENT_SECRET
   # Paste Google Client Secret when prompted

   npx wrangler secret put GMAIL_REFRESH_TOKEN
   # Paste Google Refresh Token when prompted
   ```
3. Deploy the worker:
   ```bash
   npx wrangler deploy
   ```
4. If using Cloudflare Pages native Functions:
   Add the three secrets (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`) in **Cloudflare Dashboard > Pages > Agletras > Settings > Environment variables > Production**.

---

## 7. Verification & Automated Test Evidence

### 1. Worker Unit Tests (`node --experimental-strip-types worker/tests/worker.test.mjs`)
```
✔ Security & Validation: valid inquiry payload passes (1.20ms)
✔ Security & Validation: honeypot detection flags bot submission (0.12ms)
✔ Security & Validation: missing required fields rejected (0.07ms)
✔ Security & Validation: invalid email syntax rejected (0.10ms)
✔ Security & Validation: invalid inquiry focus rejected (0.08ms)
✔ Security & Validation: CR/LF email header injection stripped (0.06ms)
✔ Security & Validation: HTML characters escaped (0.07ms)
✔ Security & Validation: Rate limiter enforces 5 requests per IP (0.13ms)
✔ CORS: returns matched allowed origin (0.11ms)
✔ Email Builder: HTML and plain-text templates generated with Agletras branding (0.80ms)
✔ Gmail MIME & Base64URL: RFC 2822 message encoded URL-safe (0.44ms)
✔ Worker Handler: GET /health returns 200 (14.02ms)
✔ Worker Handler: OPTIONS /api/inquiry returns 204 with CORS (0.46ms)
✔ Worker Handler: Missing secrets returns 500 GATEWAY_SECRETS_UNCONFIGURED (0.68ms)
✔ Worker Handler: Mocked Gmail API dispatch returns 200 confirmed (1.09ms)

Total: 15 passed, 0 failed (duration: 23.6ms)
```

### 2. Browser Verification via Chrome DevTools CDP
Tested against live preview server on port 4322:
- **Forbidden Services Audit**: `formsubmit.co`, `google.com/forms`, `emailjs`, and `formspree` verified completely absent from DOM.
- **Field Validation**: Empty fields and invalid email regex caught and surfaced with telemetry error panels.
- **Gateway Failure / Unconfirmed State**: When backend is offline or unconfigured, submit button is re-enabled, status displays `DISPATCH GATEWAY UNCONFIRMED: Your inquiry has NOT been confirmed as sent.`, and a fallback `mailto:info.agletras@gmail.com` link is presented.
- **Confirmed Success State**: When Gmail API confirms message acceptance, status displays `TRANSMISSION CONFIRMED: Inquiry verified and accepted by official Gmail API dispatch relay.` and routes to `/contact/thank-you`.
- **Mobile Viewports**:
  - `375x812`: `scrollWidth=375`, `clientWidth=375`, `overflow=0px` (**PASS**)
  - `390x844`: `scrollWidth=390`, `clientWidth=390`, `overflow=0px` (**PASS**)

### 3. Astro & Repository Test Suite
- `npm run check`: **0 errors, 0 warnings** across all 44 project files.
- `npm run build`: Static compilation completed in **387ms** across all canonical routes.
- `npm test`: **100% passed** (13 canonical routes, 7 removed service 404s, brand integrity logo checksum `df200ad9...`, and all 15 worker tests).

---

## 8. Change Control Summary

- **Modified Files**:
  - `src/pages/contact.astro`
  - `src/pages/contact/thank-you.astro`
  - `public/_headers`
  - `package.json`
- **New Files**:
  - `functions/api/inquiry.ts`
  - `worker/wrangler.toml`
  - `worker/package.json`
  - `worker/tsconfig.json`
  - `worker/src/types.ts`
  - `worker/src/security.ts`
  - `worker/src/email-template.ts`
  - `worker/src/gmail.ts`
  - `worker/src/index.ts`
  - `worker/tests/worker.test.mjs`
- **Zero git commits, zero git pushes, zero remote deployments.**
- **The separate MCP repository (`D:\ctf\era6-agletras-mcp\agletras-mcp`) was NOT modified.**
