
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface PaymentSettingsData {
  onlinePaymentEnabled: boolean;
  bankTransferEnabled: boolean;
}

export default function PaymentSettings() {
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(() => doc(firestore, 'settings', 'payment'), [firestore]);
  const { data: settings, isLoading, error } = useDoc<PaymentSettingsData>(settingsDocRef);
  
  const [onlineEnabled, setOnlineEnabled] = useState(true);
  const [bankEnabled, setBankEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setOnlineEnabled(settings.onlinePaymentEnabled);
      setBankEnabled(settings.bankTransferEnabled);
    } else if (!isLoading && !settings) {
        // If the doc doesn't exist, initialize with defaults
        const defaultSettings = { onlinePaymentEnabled: true, bankTransferEnabled: true };
        setDoc(settingsDocRef, defaultSettings);
        setOnlineEnabled(defaultSettings.onlinePaymentEnabled);
        setBankEnabled(defaultSettings.bankTransferEnabled);
    }
  }, [settings, isLoading, settingsDocRef]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc(settingsDocRef, {
        onlinePaymentEnabled: onlineEnabled,
        bankTransferEnabled: bankEnabled,
      });
      toast.success('Payment settings updated successfully.');
    } catch (err: any) {
      toast.error(`Failed to save settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-1/3 ml-auto" />
            </CardContent>
        </Card>
    )
  }

  if (error) {
    return <p className="text-destructive">Error loading payment settings: {error.message}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method Settings</CardTitle>
        <CardDescription>
          Enable or disable payment methods for the top-up store.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="online-payment" className="text-base">Online Payment</Label>
                <p className="text-sm text-muted-foreground">Allow payments via credit/debit cards.</p>
            </div>
            <Switch
                id="online-payment"
                checked={onlineEnabled}
                onCheckedChange={setOnlineEnabled}
                aria-label="Toggle Online Payment"
            />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
             <div className="space-y-0.5">
                <Label htmlFor="bank-transfer" className="text-base">Bank Transfer</Label>
                 <p className="text-sm text-muted-foreground">Allow payments via manual bank deposit.</p>
            </div>
            <Switch
                id="bank-transfer"
                checked={bankEnabled}
                onCheckedChange={setBankEnabled}
                aria-label="Toggle Bank Transfer"
            />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
}
    