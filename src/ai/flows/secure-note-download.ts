
'use server';
/**
 * @fileOverview A secure, one-time access code redemption flow for course notes.
 *
 * - redeemAccessCode - Validates a code, marks it as used, and returns a secure download URL.
 * - RedeemAccessCodeInput - Input schema for the flow.
 * - RedeemAccessCodeOutput - Output schema for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
if (!getApps().length) {
    initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS!)),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
}
const firestore = getFirestore();
const storage = getStorage();

export const RedeemAccessCodeInputSchema = z.object({
  code: z.string().min(1, "Access code is required."),
  noteId: z.string().describe("The ID of the note the user is trying to access. For validation purposes."),
  userId: z.string().describe("The ID of the user redeeming the code."),
  userEmail: z.string().describe("The email of the user redeeming the code."),
});
export type RedeemAccessCodeInput = z.infer<typeof RedeemAccessCodeInputSchema>;

export const RedeemAccessCodeOutputSchema = z.object({
  success: z.boolean().describe("Whether the code redemption was successful."),
  message: z.string().describe("A message describing the result."),
  downloadUrl: z.string().optional().describe("The secure, temporary URL to download the file."),
});
export type RedeemAccessCodeOutput = z.infer<typeof RedeemAccessCodeOutputSchema>;


export const redeemAccessCode = ai.defineFlow(
  {
    name: 'redeemAccessCode',
    inputSchema: RedeemAccessCodeInputSchema,
    outputSchema: RedeemAccessCodeOutputSchema,
  },
  async (input) => {
    const { code, noteId, userId, userEmail } = input;

    const codeRef = firestore.collection('accessCodes').doc(code);
    const codeDoc = await codeRef.get();

    if (!codeDoc.exists) {
      return { success: false, message: "Invalid access code." };
    }

    const codeData = codeDoc.data()!;

    if (codeData.isUsed) {
      return { success: false, message: "This access code has already been used." };
    }
    
    // Optional: Check if the code is for the correct note.
    // This adds a layer of security if you want to tie codes to specific units.
    // if (codeData.noteId !== noteId) {
    //   return { success: false, message: "This code is not valid for this unit." };
    // }

    const noteRef = firestore.collection('courseNotes').doc(codeData.noteId);
    const noteDoc = await noteRef.get();

    if (!noteDoc.exists) {
        return { success: false, message: "The associated course note could not be found." };
    }

    const noteData = noteDoc.data()!;

    try {
      // Mark the code as used in a transaction to ensure atomicity
      await firestore.runTransaction(async (transaction) => {
        const freshCodeDoc = await transaction.get(codeRef);
        if (freshCodeDoc.data()?.isUsed) {
          throw new Error("Code was just used by someone else.");
        }
        transaction.update(codeRef, { 
            isUsed: true,
            usedBy: userEmail,
            usedAt: new Date(),
        });
      });

      // Generate a signed URL for the file
      const file = storage.bucket().file(noteData.storagePath);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      
      return {
        success: true,
        message: "Code validated. Download starting.",
        downloadUrl: signedUrl,
      };

    } catch (error: any) {
      console.error("Error during code redemption: ", error);
      return { success: false, message: error.message || "An internal error occurred." };
    }
  }
);
