import admin from 'firebase-admin';
import type { Auth } from 'firebase-admin/auth';

const serviceAccount = {
  projectId: process.env['FIREBASE_PROJECT_ID'],
  privateKey: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
  clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const auth: Auth = admin.auth();
export default admin;