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

export interface WalletConnectSession {
  topic: string;
  peer: {
    metadata: {
      name: string;
      url?: string;
    };
  };
}

export interface SessionProposal extends SignClientTypes.EventArguments['session_proposal'] {
  params: {
    request: {
      method: string;
    };
    proposer: {
      metadata: {
        url?: string;
      };
    };
  };
}