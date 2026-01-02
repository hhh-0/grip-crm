# Product Requirements Document (PRD): Grip

### 1. Product Vision
**Grip** is the "Zero-Config" CRM designed to move small teams from sign-up to active selling in under 15 minutes. Unlike enterprise incumbents that function as empty shells requiring expensive construction, Grip comes pre-assembled with opinionated, high-velocity workflows. We reject the "land and expand" model of hiding features behind paywalls; instead, we offer a friction-free infrastructure that handles ingestion, enrichment, and outreach instantly, allowing founders and small teams to grip their pipeline without hiring an Ops manager.

### 2. Target User Persona
*   **Name:** The "Sprint" Founder/Lead.
*   **Profile:** Runs a team of 2–10 people (agency, boutique SaaS, or high-ticket service).
*   **Pain Point:** Currently managing 60+ leads in a breaking Google Sheet or churning from HubSpot due to the "absurd" jump from Starter to Pro pricing.
*   **Behavior:** Values speed over customization. Doesn't have time to map complex data models or configure APIs; needs to send emails and track deals *today*.

### 3. Core Features (MVP)
*Focus: Set Up Velocity*

1.  **"Instant-Ingest" Contact Processor:**
    *   *Feature:* Drag-and-drop CSV import that auto-maps fields without user intervention, combined with a browser extension that scrapes LinkedIn profiles directly into the pipeline with one click.
    *   *Solving:* Eliminates the "nightmare" of data migration and manual entry.

2.  **The "Pre-Wired" Pipeline:**
    *   *Feature:* A pipeline that comes pre-built with standard stages (New, Contacted, Negotiating, Won) and pre-written email templates attached to each stage transition.
    *   *Solving:* Removes the "blank slate" paralysis and the need for expensive onboarding consultants.

3.  **Native "Zero-Touch" Sync:**
    *   *Feature:* A one-click OAuth connection to Gmail/Outlook that automatically logs emails and calendar events to the correct contact *without* installing plugins or sidebars.
    *   *Solving:* Addresses the "API errors" and sync failures common in other tools,.

4.  **Velocity Command Center (Unified Inbox):**
    *   *Feature:* A single view combining email, SMS, and tasks. Instead of clicking into individual deal records (reducing clicks), users can power through follow-ups in a "feed" view.
    *   *Solving:* Addresses usability complaints about "horribly slow" interfaces and excessive clicking to find information,.

5.  **Flat-Rate "No Cliff" Pricing Model:**
    *   *Feature:* All features (including bulk email and reporting) included in a single per-seat price. No "add-ons" for essential utility.
    *   *Solving:* Directly attacks the "predatory pricing" and "forced upgrade" pain points,.

### 4. Explicitly Excluded Features (v1.0)
*   **Website/Landing Page Builder:** We are not a CMS (unlike HubSpot). We focus strictly on sales velocity.
*   **Custom Object Creation:** To maintain speed and simplicity, users must use standard objects (Contacts, Companies, Deals) for the MVP.
*   **Ticketing/Help Desk:** We are solving for Sales/Growth, not Customer Support (yet).
*   **Complex Permissions/Hierarchies:** All users have admin access in the MVP to prevent the "baffling user permissions" friction.

### 5. Success Metrics
*   **Time-to-First-Action (TTFA):** The median time from account creation to the first logged external interaction (email sent or call logged). *Target: < 15 minutes.*
*   **Import Completion Rate:** Percentage of users who successfully upload and map a contact list within their first session. *Target: > 90%.*
*   **Velocity Score:** Average number of leads processed (moved stages or contacted) per active user per day.
*   **Support-Load Ratio:** Number of support tickets raised per 100 users (validating our "intuitive/no-training" hypothesis).