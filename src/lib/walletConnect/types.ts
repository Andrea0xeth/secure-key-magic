import { Transaction, TransactionType } from 'algosdk';

export type TransactionCallback = (transaction: Transaction) => void;

export interface AlgorandTransaction {
  type: TransactionType;
  from: { publicKey: Uint8Array };
  to: { publicKey: Uint8Array };
  amount: bigint;
  fee: number;
  firstRound: number;
  lastRound: number;
  note?: Uint8Array;
  genesisID: string;
  genesisHash: string;
  group?: Uint8Array;
  signTxn: (privateKey: Uint8Array) => Uint8Array;
}