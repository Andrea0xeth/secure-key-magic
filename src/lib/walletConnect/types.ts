import type { Transaction, TransactionType } from 'algosdk';

export interface AlgorandTransaction extends Transaction {
  signTxn: (privateKey: Uint8Array) => Uint8Array;
  type: TransactionType;
  from?: {
    publicKey: Uint8Array;
  };
  to?: {
    publicKey: Uint8Array;
  };
  amount?: bigint;
  fee?: number;
  group?: Uint8Array;
}

export interface TransactionParams {
  type: TransactionType;
  snd?: Uint8Array;
  rcv?: Uint8Array;
  amt?: number;
  fee?: number;
  fv?: number;
  lv?: number;
  note?: Uint8Array;
  gen?: string;
  gh?: string;
}

export type TransactionCallback = (transaction: AlgorandTransaction) => void;