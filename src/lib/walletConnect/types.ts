import type { SignClientTypes } from '@walletconnect/types';
import * as algosdk from "algosdk";

export type SessionProposalEvent = SignClientTypes.EventArguments['session_proposal'];

export interface TransactionParams extends algosdk.Transaction {
  type: algosdk.TransactionType;
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

export type TransactionCallback = (transaction: algosdk.Transaction) => void;