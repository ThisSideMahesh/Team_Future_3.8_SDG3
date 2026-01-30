🩺 SwasthyaSetu
Ek Jeevan. Ek Swasthya Drishti.

SwasthyaSetu is a Bharat-centric Universal Health Record Aggregation Platform designed to securely connect fragmented hospital EMR systems using role-based, consent-driven APIs.
It enables authorized healthcare professionals to access a single unified patient view without replacing existing hospital infrastructure.

📌 Problem Statement (PS ID: 3.8)
Create a universal health record aggregator using secure APIs for interoperability, targeting hospital EMR integrations.
Healthcare data today is siloed across multiple hospitals and systems, leading to delayed care, repeated diagnostics, and high risk during emergencies.

💡 Solution Overview
SwasthyaSetu acts as an API-first interoperability layer, not a new EMR.
It aggregates patient health records from multiple hospital systems into a unified view while enforcing:
Patient consent by default
Strict role-based access control
Limited, audited emergency access
Institution-level data isolation

🏗️ System Architecture (High Level)
Frontend: Next.js (App Router) + React
Backend: Firebase (Firestore, Auth, Admin SDK)
APIs: Institution-scoped REST APIs
Security: Multi-layer RBAC + consent validation
Deployment Style: Jamstack, serverless, scalable

👥 User Roles & Responsibilities

1️⃣ Patient
Manage consent
View unified health record
View access logs
UI only (no APIs)

2️⃣ Healthcare Provider
Access patient records with consent
Emergency access (critical data only)
Create TEMP-ID for unidentified patients
Uses secure APIs

3️⃣ Healthcare Institution Admin
Manage healthcare provider accounts
View institution-level logs (no patient data)
Governance only
Uses admin APIs

4️⃣ SwasthyaSetu Platform Admin
Approve institutions
Generate and manage API credentials
Monitor platform health & compliance
No patient or clinical data access

🔐 Security & Privacy Model
Privacy > Convenience
Consent enforced before every clinical access

Emergency access is:
Read-only
Limited to critical data
Fully logged and audited
No admin role can access patient medical data
Raw hospital EMR data is never permanently stored

🔌 API-First Interoperability
APIs are institution-scoped
API access is created and governed only by Platform Admin
Supports integration with:
Hospital EMRs
Emergency systems
Clinical dashboards

No APIs are exposed for:
Patients
Platform Admin (UI-only governance)

💰 Revenue Model
B2B SaaS
Hospitals pay subscription + API usage fees
B2G (Future Scope)
Licensing for public health networks
Patients always free
No ads, no data selling

📈 Scalability
Add hospitals via APIs, not redesigns
Institution-isolated architecture
Serverless backend scales with demand
Suitable from local clinics to national health infrastructure

🎯 Impact & SDG Mapping
SDG 3 – Good Health & Well-Being
Improves continuity of care
Reduces medical errors
Enables faster emergency decisions
Strengthens healthcare interoperability

🧪 Demo & Development
Uses fictional hospitals and users for demo safety
Pre-seeded data for quick evaluation
Designed for hackathon and real-world feasibility

🛠️ Tech Stack
Next.js 15 + React 19
TypeScript
ShadCN/UI + Tailwind CSS
Firebase Firestore & Authentication
Firebase Admin SDK
RBAC + Consent-Driven Access
Dark Mode Supported (HSL Theming)

🧠 Core Principle
Hospitals pay. Patients don’t.
Privacy is never compromised for convenience.

🏁 Conclusion
SwasthyaSetu provides a secure, scalable, and governance-driven solution to healthcare data fragmentation, fully aligned with PS 3.8 and SDG 3, while remaining practical for real-world adoption.

👥 Team
Team Future

Mahesh Namdev Khandebharad – Builder & Pitcher

Aarpita Bhagwan Kalyankar – UI/UX, Documentation, Pitcher
