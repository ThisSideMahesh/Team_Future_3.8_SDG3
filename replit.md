# SwasthyaSetu - Unified Health Record Platform

## Overview
SwasthyaSetu is a unified platform connecting patients and healthcare providers for a seamless healthcare experience. It allows users to access their aggregated health records from multiple providers, all in one place.

## Tech Stack
- **Framework**: Next.js 15.5.9 with Turbopack
- **Language**: TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Database**: Firebase/Firestore
- **AI**: Genkit with Google GenAI
- **Styling**: Tailwind CSS with tailwindcss-animate

## Project Structure
```
src/
├── ai/          # Genkit AI integrations
├── app/         # Next.js app router pages
├── components/  # React components
├── firebase/    # Firebase configuration
├── hooks/       # Custom React hooks
└── lib/         # Utility libraries
```

## Running the Project
- Development: `npm run dev` (runs on port 5000)
- Build: `npm run build`
- Start: `npm run start`

## Configuration
- The app is configured to run on port 5000 for Replit compatibility
- Host is set to 0.0.0.0 to allow external access
- All dev origins are allowed for proxy support

## Recent Changes
- 2026-01-30: Configured for Replit environment (port 5000, host 0.0.0.0, allowedDevOrigins)
