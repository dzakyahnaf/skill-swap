const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin SDK initialized successfully');
      } else {
        console.log('Firebase Admin SDK not initialized: serviceAccountKey.json not found');
      }
    }
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
  }
};

module.exports = {
  admin,
  initializeFirebase
};
