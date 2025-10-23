
'use client';

import { FirebasePricingProvider } from "@/firebase/pricing-provider";
import PricingManagement from "./pricing-management";

export default function WebPricingManagement() {
  return (
    <FirebasePricingProvider>
      <PricingManagement />
    </FirebasePricingProvider>
  );
}
