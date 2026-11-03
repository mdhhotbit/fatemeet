export interface GuestbookEntry {
  id: number;
  sender: `0x${string}`;
  content: string;
  timestamp: number; // in milliseconds
  txHash?: `0x${string}`;
}

export type SubmissionStatus =
  | 'idle'
  | 'waiting_wallet'
  | 'confirming'
  | 'success'
  | 'error';
