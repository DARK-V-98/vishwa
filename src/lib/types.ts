
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
    matchCount?: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface MatchScore {
  kills: number;
  placement: number;
  bonus: number;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  players: string[];
  region: string;
  matchScores: MatchScore[];
}


export interface TournamentBudget {
    tournamentName: string;
    gameType: string;
    gameMode: string;
    participants: number;
    tournamentType: 'online' | 'physical' | 'mixed';
    regFeeType: 'fixed' | 'per-player' | 'per-team';
    regFeeAmount: number;
    estimatedPrizePool: number;
    refereeCost: number;
    venueCost: number;
    autoCalculatePrizePool: boolean;
    extraFees: boolean;
    income: {
        sponsorship: number;
        advertisements: number;
        platformCharges: number;
    };
    expenses: {
        prizePoolDistribution: {
            firstPlace: number;
            secondPlace: number;
            thirdPlace: number;
            specialAwards: number;
        };
        staff: {
            organizers: number;
            referees: number;
            moderators: number;
            casters: number;
            designers: number;
            editors: number;
        };
        technical: {
            roomCards: number;
            servers: number;
            botChecking: number;
            antiCheat: number;
        };
        marketing: {
            posters: number;
            paidAds: number;
            influencers: number;
        };
        venue: {
            stage: number;
            seating: number;
            soundLighting: number;
            cameraCrew: number;
        };
        extra: {
            transport: number;
            food: number;
            trophies: number;
            medals: number;
            certificates: number;
        }
    };
    // Calculated fields for summary
    totalIncome: number;
    totalExpenses: number;
    profitOrLoss: number;
}

export interface WebOrder {
  id: string; // The unique order ID (e.g., 4829A)
  createdByAdmin: boolean;
  userId: string | null; // The client's UID, null until bound
  clientPhone: string;
  websiteType: string;
  totalCost: number;
  monthsAllowed: number;
  monthlyAmount: number;
  status: 'Pending Client Details' | 'In Progress' | 'Completed';
  currentStage: 'Designing' | 'Developing' | 'Testing' | 'Completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WebOrderDetail {
  orderId: string; // Foreign key to WebOrder
  fullName: string;
  businessName: string;
  features: string;
  hostingOption: 'provide' | 'existing';
  domainOption: 'new' | 'existing';
  paymentPlanType: 'full' | 'monthly';
  selectedMonths?: number;
  submittedAt: Timestamp;
}

export interface WebOrderUpdate {
  id: string;
  orderId: string; // Foreign key to WebOrder
  stage: 'Designing' | 'Developing' | 'Testing' | 'Completed';
  note: string;
  attachmentUrl?: string;
  timestamp: Timestamp;
}
