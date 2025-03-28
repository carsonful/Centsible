

interface usertype {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string;
    emailAddress?: string;
    imageUrl?: string;
    createdAt?: Date | null;
} export type { usertype };


interface transactionType {
    id?: string;
    userId?: string;
    name?: string;
    amount?: number;
    category?: string;
    date?: Date;
    notes?: string;
    userfullname?: string;
} export type { transactionType };



// If not already in your types.ts, add:

interface householdType {
    id?: string;
    name: string;
    ownerId: string;
    createdAt?: Date;
} export type { householdType };