# **App Name**: SwasthyaSetu: Ek Jeevan. Ek Swasthya Drishti.

## Core Features:

- Doctor Authentication: Secure doctor login with role-based access control using Firebase Authentication.
- Patient Authentication: Secure patient login with role-based access control using Firebase Authentication.
- Mock Hospital EMR Integration: Fetch patient data from two mock hospital REST APIs (Hospital A and Hospital B) with different schemas.
- Data Normalization: Normalize fetched data into a unified SwasthyaSetu health record schema within Cloud Functions.
- Aggregated Record Storage: Store the aggregated patient health record in Firestore, excluding raw hospital data.
- Consent Management: Implement patient-controlled consent for data aggregation.
- Doctor Dashboard: Enable patient search via Patient ID and display aggregated medical timeline with alerts for allergies and chronic diseases.
- Patient Dashboard: Allow patients to view their unified health record, manage data consent, and view access logs.

## Style Guidelines:

- Primary color: Light blue (#ADD8E6) to evoke a sense of calmness, cleanliness, and health, inspired by the medical field and water which is essential for life and health.
- Background color: Very light blue (#F0F8FF), nearly white, to maintain a clean and professional appearance.
- Accent color: Soft green (#90EE90) to align with the logo and add a natural, calming element, complementary to the blue theme.
- Body text: 'PT Sans', a modern humanist sans-serif for readability and a touch of warmth. Headlines: 'Space Grotesk' to give a computerized feeling.
- Utilize flat, minimalist icons in shades of blue and green to represent medical data points and actions, ensuring clarity and ease of understanding.
- Design a clean and intuitive layout, prioritizing key information for emergency usability, using clear sections and prominent buttons.
- Avoid unnecessary animations to maintain stability; use subtle transitions for loading states to provide feedback without distraction.