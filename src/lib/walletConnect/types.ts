import * as algosdk from "algosdk";
import type { SignClientTypes } from '@walletconnect/types';

export type SessionProposalEvent = SignClientTypes.EventArguments['session_proposal'];

export interface AlgorandTransaction extends algosdk.Transaction {
  from?: { publicKey: Uint8Array };
  to?: { publicKey: Uint8Array };
  amount?: number | bigint;
  type?: algosdk.TransactionType;
  fee?: number;
}

export interface TransactionParams {
  type: algosdk.TransactionType;
  snd: Uint8Array;
  rcv: Uint8Array;
  amt: number;
  fee: number;
  fv: number;
  lv: number;
  note?: Uint8Array;
  gen?: string;
  gh?: string;
}

export type TransactionCallback = (transaction: AlgorandTransaction) => void;

export interface WalletConnectConfig {
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}