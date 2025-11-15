
import { Timestamp } from 'firebase/firestore';

export interface Tournament {
    id: string;
    userId: string;
    tournamentName: string;
    organizerName: string;
    organizerEmail: string;
    contactNumber: string;
    gameType: string;
    posterUrl: string;
    description: string;
    rules: string;
    prizePool: string;
    entryFee: string;
    startDate: Timestamp;
    endDate: Timestamp;
    registrationLink: string;
    status: 'published' | 'pending-approval' | 'rejected';
    createdAt: Timestamp;
}
