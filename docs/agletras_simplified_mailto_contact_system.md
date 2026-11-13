# AGLETRAS — SIMPLIFIED MAILTO CONTACT INTAKE SYSTEM

**Architecture:** Pure Client-Side Zero-Backend Intake Protocol  
**Target Recipient:** `info.agletras@gmail.com`  
**Protocol:** Standard RFC 6068 `mailto:` URI Scheme  
**Security & Privacy Tier:** Zero External Databases, Zero Third-Party Form Handlers, Zero Cloudflare Serverless Functions, Zero Cloud Credentials  
**Status:** **IMPLEMENTED & FULLY VERIFIED**  
**Date:** 2026-11-13  

---

## 1. Architectural Summary & Rationale

Per directive, Agletras Intelligence has eliminated the complex private Cloudflare Worker and Gmail API OAuth relay infrastructure in favor of a lean, reliable, zero-backend `mailto:` intake protocol.

### Why this architecture excels:
1. **Zero External Points of Failure:** Eliminates Cloudflare Worker DNS issues (`ERR_NAME_NOT_RESOLVED`), OAuth token expiration/revocation, API quotas, and third-party form-handler downtime.
2. **Absolute Privacy & Data Sovereignty:** Research scoping parameters are constructed strictly in the visitor's local browser memory and handed off directly to their system email client. No third-party servers, intermediate databases, or logging layers ever touch the inquiry text.
3. **100% Static & GitHub Pages Native:** Zero backend dependencies. Works identically on GitHub Pages, Cloudflare Pages, IPFS, or local development servers.
4. **Honest, Unambiguous User Communication:** The interface never falsely claims an inquiry was "sent" or "delivered" merely because a link was triggered. It clearly informs the visitor that their email composer has opened and they must press **Send** to dispatch.

---

## 2. Intake Specification & Form Fields

The Agletras Research Scoping intake form in [`src/pages/contact.astro`](file:///D:/New%20folder%20(2)/Agletras-Rebuild/src/pages/contact.astro) preserves its distinctive dark emerald aesthetic and all four scoping fields:

1. **`01 // ORGANIZATION / COUNTERPARTY NAME:`** (`id="form-org"`, `name="organization"`)
2. **`02 // AUTHORIZED REPRESENTATIVE EMAIL:`** (`id="form-email"`, `name="email"`)
3. **`03 // RESEARCH INQUIRY FOCUS:`** (`id="form-inquiry-focus"`, `name="inquiry_focus"`)
   - Business Partner & Company Checks (Commercial Due Diligence)
   - Ownership & Corporate Relationship Tracing
   - Leadership Background & Credential Verification
   - Online Threats & Brand Impersonation Research
   - Agletras MCP Infrastructure & Integration
   - General Scoping & Research Inquiry
4. **`04 // TARGET ANCHORS & SCOPING OBJECTIVE:`** (`id="form-research-objective"`, `name="research_objective"`)

---

## 3. Client-Side Validation & Bot Filtering

### 3.1 Field Validation & Character Limits
Before opening the mailto link, client-side JavaScript validates:
- **Required Fields:** All four intake specification fields must be populated with non-whitespace text. If any field is missing, the status region displays:
  ```
  VALIDATION ERROR: All intake specification fields are required prior to dispatch.
  ```
- **Email Format:** Validated against standard RFC email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). If invalid:
  ```
  INVALID EMAIL FORMAT: Please enter a valid corporate or professional email address.
  ```
- **Research Objective Character Limit:** Capped at 2,000 characters (`maxlength="2000"`) to guarantee reliable URI length compatibility across all desktop and mobile OS protocol handlers. A live counter displays real-time character usage (`0 / 2,000 characters`) with visual near-limit feedback. If exceeded:
  ```
  CHARACTER LIMIT EXCEEDED: Target anchors & scoping objective cannot exceed 2,000 characters.
  ```

### 3.2 Basic Client-Side Honeypot Trap
The form includes a hidden, non-indexed input:
```html
<input type="text" id="form-honey" name="_honey" style="display:none;" tabindex="-1" autocomplete="off" aria-hidden="true" />
```
Automated spam harvesters filling this field are caught locally. The submission is discarded with:
```
DISPATCH FILTERED: Submission filtered by basic client-side automated spam trap.
```
*Note on Evidentiary Honesty:* This honeypot is transparently documented as a basic client-side filter and makes no claim of comprehensive bot immunity.

---

## 4. Mailto Payload Construction & URI Encoding

When validation passes, the client constructs a structured, URL-safe `mailto:` URI:

```typescript
const subject = `New Agletras Research Inquiry — ${org} [${inquiry_focus}]`

const body =
  `AGLETRAS RESEARCH INTELLIGENCE // SCOPING INTAKE DOSSIER\r\n` +
  `============================================================\r\n` +
  `ORGANIZATION / COUNTERPARTY:\r\n${org}\r\n\r\n` +
  `AUTHORIZED REPRESENTATIVE EMAIL:\r\n${email}\r\n\r\n` +
  `RESEARCH INQUIRY FOCUS:\r\n${inquiry_focus}\r\n\r\n` +
  `TARGET ANCHORS & SCOPING OBJECTIVE:\r\n${research_objective}\r\n\r\n` +
  `============================================================\r\n` +
  `CONFIDENTIALITY PROTOCOL:\r\n` +
  `This inquiry initiates preliminary research scoping. Mutual NDA is requested prior to evidentiary record exchange.`

const mailtoUrl = `mailto:info.agletras@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

window.location.href = mailtoUrl
```

---

## 5. Truth-in-Delivery Feedback & UX

In strict compliance with evidentiary honesty principles:
- The UI **never** reports "Delivered", "Sent", or "Message Transmitted".
- The UI **never** claims that JavaScript verified whether the email application opened.
- The UI clearly informs the visitor:
  ```
  EMAIL COMPOSER REQUESTED — Complete and send your inquiry from your email application.
  ```
- Clear instructions state:
  > **Browser Capability Disclosure:** Web browsers cannot verify whether your email client opened successfully. If your email application did not launch automatically, click the button below to open or copy your inquiry.  
  > **Action Required:** You must click **Send** in your email application to transmit the inquiry. Your inquiry is *not sent or delivered* merely because the composer was requested.
- **Preservation of User Input:** Entered information across all fields is strictly preserved in the form (never wiped with `form.reset()`), allowing visitors to reference or copy their brief if needed.
- A prominent fallback button (`Re-open Email Composer ↗`) is rendered directly in the status box with the full `mailto:` URI.
- The submit button updates its label to `EMAIL COMPOSER REQUESTED`.

---

## 6. Deleted & Cleaned Infrastructure Files

The following obsolete backend worker files, directories, and configuration entries have been completely removed:

1. **`worker/` (Deleted directory):**
   - `worker/src/index.ts`
   - `worker/src/security.ts`
   - `worker/src/types.ts`
   - `worker/src/gmail.ts`
   - `worker/src/email-template.ts`
   - `worker/wrangler.toml`
   - `worker/tests/worker.test.mjs`
2. **`functions/` (Deleted directory):**
   - `functions/api/inquiry.ts`
3. **`public/_headers` (Cleaned):**
   - Removed `connect-src https://*.workers.dev https://inquiry.agletras.com;`
   - Retained strict CSP `connect-src 'self'; form-action 'self' mailto:;`
4. **`package.json` (Updated):**
   - Removed `test:worker` and obsolete `worker.test.mjs` invocations.
   - Added `node tests/contact-mailto.test.mjs`.

---

## 7. Verification Evidence

- **Astro Diagnostics (`npm run check`):** 0 errors, 0 warnings across all 38 files.
- **Static Compilation (`npm run build`):** All 14 routes successfully generated in `dist/`.
- **Regression Suite (`npm test`):**
  - Route structure verified (13 canonical routes 200, 7 removed routes 404).
  - Authentic Agletras logo checksum verified (`df200ad951c08c78c936f5a4d7cd6c981c0c879e0df75dafc332d1d89e788b30`).
  - Content coverage & ethical boundary disclosures verified.
  - Zero backend references verified in `tests/contact-mailto.test.mjs`.
- **Browser CDP Automation (`test_mailto_browser.py`):**
  - Confirmed absence of forbidden backend strings in DOM.
  - Verified empty validation and email regex validation.
  - Verified honeypot trap execution.
  - Verified mailto URL encoding with all four fields.
  - Verified honest status copy and button update.
  - Verified 0px horizontal overflow across mobile viewports (375px and 390px).

---
*Report Prepared for Agletras Intelligence Engineering Review.*
