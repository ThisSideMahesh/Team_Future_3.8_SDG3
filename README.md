🏥 SwasthyaSetu
Ek Jeevan. Ek Swasthya Drishti.

SwasthyaSetu is a Bharat-centric Universal Health Record Aggregator designed to securely unify fragmented hospital medical records into a single, consent-driven patient view, with special focus on emergency care and interoperability.
This project is built as a hackathon-ready, production-style prototype aligned with Problem Statement 3.8.

🎯 Problem Statement (PS 3.8)
Create a universal health record aggregator using secure APIs for interoperability, targeting hospital EMR integrations.

💡 Solution Overview
Today, patient medical data is scattered across multiple hospitals and systems.
SwasthyaSetu acts as a secure aggregation layer that:
Connects multiple hospitals through institution-scoped APIs
Aggregates patient records into one unified view
Enforces patient consent by default
Allows limited emergency access when consent is unavailable
Maintains strict role-based access control
Hospitals never directly access each other’s data — all access flows through SwasthyaSetu.

🧱 Architecture (Track A)
Frontend
Next.js (App Router)
Hosted on AWS Amplify
Backend
Firebase Authentication
Firestore Database
Firestore Security Rules
CI/CD
GitHub → AWS Amplify auto-deploy
Cloud Functions are intentionally not used in this demo to avoid paid plan dependencies.
The architecture is fully extensible to server-side APIs in production.
👥 User Roles
Role	Responsibility
Patient	Owns data, manages consent, views access logs
Healthcare Provider	Views unified records with consent or emergency access
Institution Admin	Manages providers and institutional activity (no medical data)
Platform Admin	Manages institutions and APIs (no clinical access)

🖥️ Dashboards
👤 Patient Dashboard
View unified health record
Grant / revoke consent
View access logs
Emergency-visible critical data (read-only)

🩺 Healthcare Provider Dashboard
Search patient by ID / QR / TEMP-ID
Fetch unified health record
Emergency access (limited fields)
Create TEMP-ID for unidentified patients

🏢 Institution Admin Dashboard
Manage healthcare providers
View institutional activity metrics (counts only)
No access to patient medical data

🌐 Platform Admin Dashboard
Onboard hospitals
Manage API credentials
View platform-level metrics
No access to clinical data

🚨 Emergency Handling (Key Feature)
Emergency access is read-only
Returns only:
Blood group
Allergies
Chronic conditions
Every emergency access is logged and auditable
Supports TEMP-ID for unidentified patients, later mergeable

🔐 Security Principles
Consent before access
Role-based access control
Institution-level isolation
Audit logging
No raw EMR data stored
No real patient data used

📦 Demo Data
The system uses fully fictional demo data:
Hospital A, B, and C
Fictional doctors, admins, and patients
Sample medical records for demonstration

⚠️ No real-world datasets or personal data are used.

🚀 Deployment
AWS Amplify (Frontend)
Connected to GitHub main branch
Auto-deploy on push
Uses Amplify-managed WAF with default protections
Firebase (Backend)
Firebase Authentication
Firestore (asia-south1 – Mumbai)
Firestore Security Rules enforced

🛠️ Local Setup
git clone https://github.com/ThisSideMahesh/Team_Future_3.8_SDG3.git
cd Team_Future_3.8_SDG3
npm install
npm run dev
Environment variables (handled in Amplify for production):
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

📊 SDG Alignment
SDG 3 – Good Health and Well-Being
Improves emergency response
Reduces medical data fragmentation
Enables continuity of care
Strengthens healthcare interoperability

🔮 Future Scope
Server-side aggregation APIs (Cloud Functions / AWS Lambda)
Integration with real hospital EMRs
Full AWS-native backend (Cognito, API Gateway, DynamoDB)
National-scale interoperability layer

🏁 Demo Readiness
✔ Role-based dashboards working
✔ Consent enforcement
✔ Emergency access flow
✔ Secure, explainable architecture
✔ 90-second judge explanation ready

📢 Final Note
SwasthyaSetu is designed to be simple, secure, and scalable — prioritizing correctness and trust over buzzwords.
One Patient. One Health View. For Bharat.
