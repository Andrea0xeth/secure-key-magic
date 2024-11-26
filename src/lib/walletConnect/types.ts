import { Transaction } from 'algosdk';

export type TransactionCallback = (transaction: Transaction) => void;

export interface AlgorandTransaction {
  type: 'pay' | 'axfer' | 'acfg' | 'afrz' | 'appl' | 'keyreg';
  from?: string;
  to?: string;
  amount?: number;
  fee?: number;
  firstRound?: number;
  lastRound?: number;
  note?: Uint8Array;
  genesisID?: string;
  genesisHash?: string;
}