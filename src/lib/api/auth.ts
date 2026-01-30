
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/api/admin';
import type { Institution, ApiCredential } from '@/lib/types';

export type ApiRole = 'healthcare_provider' | 'institution_admin';

type AuthenticatedApiHandler = (
    req: NextRequest,
    context: { params: any; institution: Institution; role: ApiRole }
) => Promise<NextResponse>;

/**
 * A higher-order function that wraps a Next.js API route handler to add authentication and authorization.
 * It validates an institution-specific API key and a user role.
 *
 * @param handler The API route handler to protect.
 * @param allowedRoles An array of roles that are permitted to access this endpoint.
 * @returns An authenticated and authorized API route handler.
 */
export function withApiAuth(handler: AuthenticatedApiHandler, allowedRoles: ApiRole[]) {
    return async (req: NextRequest, context: { params: any }) => {
        const authHeader = req.headers.get('Authorization');
        const roleHeader = req.headers.get('X-User-Role') as ApiRole | null;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing or invalid Authorization header. Expected: Bearer <API_KEY>' }, { status: 401 });
        }

        if (!roleHeader) {
            return NextResponse.json({ error: 'Forbidden: Missing X-User-Role header.' }, { status: 403 });
        }

        if (!allowedRoles.includes(roleHeader)) {
            return NextResponse.json({ error: `Forbidden: Role '${roleHeader}' is not allowed for this endpoint.` }, { status: 403 });
        }

        const apiKey = authHeader.split(' ')[1];
        if (!apiKey) {
            return NextResponse.json({ error: 'Unauthorized: API key is missing from Bearer token.' }, { status: 401 });
        }

        try {
            const credsRef = adminDb.collection('api_credentials');
            const q = credsRef.where('api_key', '==', apiKey).where('enabled', '==', true);
            const querySnapshot = await q.get();

            if (querySnapshot.empty) {
                return NextResponse.json({ error: 'Unauthorized: Invalid or disabled API key.' }, { status: 401 });
            }

            const credDoc = querySnapshot.docs[0];
            const apiCredential = credDoc.data() as ApiCredential;

            const institutionDoc = await adminDb.collection('institutions').doc(apiCredential.institution_id).get();
            if (!institutionDoc.exists) {
                return NextResponse.json({ error: 'Unauthorized: Institution associated with API key not found.' }, { status: 401 });
            }

            const institution = { id: institutionDoc.id, ...institutionDoc.data() } as Institution;

            // All checks passed. Call the actual API handler with the validated institution and role.
            return handler(req, { ...context, institution, role: roleHeader });

        } catch (error) {
            console.error('API Authentication Error:', error);
            return NextResponse.json({ error: 'Internal Server Error during authentication.' }, { status: 500 });
        }
    };
}
