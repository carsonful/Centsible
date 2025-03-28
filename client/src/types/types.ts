

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
} export type { transactionType };