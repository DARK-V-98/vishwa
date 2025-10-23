
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const PRICING_APP_NAME = 'pricingApp';

const pricingFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_PRICING_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_PRICING_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PRICING_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_PRICING_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_PRICING_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_PRICING_FIREBASE_APP_ID,
};

let pricingApp: FirebaseApp | null = null;
let pricingFirestore: Firestore | null = null;

function initializePricingApp() {
    // Ensure this only runs on the client
    if (typeof window === 'undefined') {
        return;
    }

    // Check if the required config values are present
    if (!pricingFirebaseConfig.projectId) {
        console.warn("Pricing Firebase project ID is not set. The pricing database will not be available.");
        return;
    }

    const existingApp = getApps().find(app => app.name === PRICING_APP_NAME);
    if (existingApp) {
        pricingApp = existingApp;
    } else {
        pricingApp = initializeApp(pricingFirebaseConfig, PRICING_APP_NAME);
    }
    pricingFirestore = getFirestore(pricingApp);
}

// Initialize on module load
initializePricingApp();

export function getPricingFirestore(): Firestore | null {
    if (!pricingFirestore) {
      // This might be called before initialization is complete, so we try again.
      initializePricingApp();
    }
    return pricingFirestore;
}
