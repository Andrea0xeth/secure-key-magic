import type { Transaction } from 'algosdk';
import type { SignClientTypes } from '@walletconnect/types';

export type SessionProposalEvent = SignClientTypes.EventArguments['session_proposal'];

export interface AlgorandTransaction extends Omit<Transaction, 'fee'> {
  signTxn: (privateKey: Uint8Array) => Uint8Array;
  type: 'pay' | 'axfer' | 'acfg' | 'afrz' | 'appl' | 'keyreg';
  from?: {
    publicKey: Uint8Array;
  };
  to?: {
    publicKey: Uint8Array;
  };
  amount?: bigint;
  fee: number;
  group?: Uint8Array;
}

export interface TransactionParams {
  type: 'pay' | 'axfer' | 'acfg' | 'afrz' | 'appl' | 'keyreg';
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