import type { SignClientTypes } from '@walletconnect/types';
import * as algosdk from "algosdk";

export interface DecodedAlgorandTransaction {
  type?: algosdk.TransactionType;
  snd?: Uint8Array;
  rcv?: Uint8Array;
  amt?: number | bigint;
  fee?: number;
  fv?: number;
  lv?: number;
  note?: Uint8Array;
  gen?: string;
  gh?: string;
}

export type TransactionCallback = (transaction: algosdk.Transaction) => void;

export type SessionProposalEvent = SignClientTypes.EventArguments['session_proposal'];

export interface AlgorandTransactionParams {
  type: algosdk.TransactionType;
  from: Uint8Array;
  to: Uint8Array;
  amount: number;
  fee: number;
  firstRound: number;
  lastRound: number;
  note?: Uint8Array;
  genesisID: string;
  genesisHash: string;
}