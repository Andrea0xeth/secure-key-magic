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

export interface WalletConnectSession {
  topic: string;
  peer: {
    metadata: {
      name: string;
    };
  };
}

export interface SessionProposal {
  id: number;
  params: {
    request?: {
      method: string;
      params: any[];
    };
    chainId?: string;
    [key: string]: any;
  };
}