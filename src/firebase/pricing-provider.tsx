
'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp, initializeApp, getApps, getApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

// Define a separate configuration for the pricing database
const pricingFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_PRICING_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_PRICING_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PRICING_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_PRICING_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_PRICING_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_PRICING_FIREBASE_APP_ID,
};

// Unique name for the pricing Firebase app instance
const PRICING_APP_NAME = 'pricing-db';

interface FirebasePricingContextState {
  pricingApp: FirebaseApp | null;
  pricingDb: Firestore | null;
}

const FirebasePricingContext = createContext<FirebasePricingContextState | undefined>(undefined);

export const FirebasePricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const services = useMemo(() => {
    // Check if the specific named app already exists
    const existingApp = getApps().find(app => app.name === PRICING_APP_NAME);
    if (existingApp) {
      return {
        pricingApp: existingApp,
        pricingDb: getFirestore(existingApp),
      };
    }
    
    // Check if the config values are provided before initializing
    if (pricingFirebaseConfig.projectId) {
      const newApp = initializeApp(pricingFirebaseConfig, PRICING_APP_NAME);
      return {
        pricingApp: newApp,
        pricingDb: getFirestore(newApp),
      };
    }

    // Return null if config is not available
    return { pricingApp: null, pricingDb: null };
  }, []);

  return (
    <FirebasePricingContext.Provider value={services}>
      {children}
    </FirebasePricingContext.Provider>
  );
};

export const usePricingDb = (): Firestore => {
  const context = useContext(FirebasePricingContext);
  if (context === undefined) {
    throw new Error('usePricingDb must be used within a FirebasePricingProvider.');
  }
  if (!context.pricingDb) {
      throw new Error("Pricing database is not configured. Ensure pricing environment variables are set.");
  }
  return context.pricingDb;
};
