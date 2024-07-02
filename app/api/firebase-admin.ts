// pages/api/firebase-admin.js
import admin from 'firebase-admin';

const serviceAccount = require('@/wellness-6082a-firebase-adminsdk-hv799-68262736bd.json'); // Replace with your actual path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
