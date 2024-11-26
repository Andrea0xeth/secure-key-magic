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

export interface SessionProposal {
  id: number;
  params: {
    id: number;
    requiredNamespaces: {
      algorand?: {
        methods: string[];
        chains: string[];
        events: string[];
      };
    };
    request?: {
      method: string;
      params: any[];
    };
  };
}

export interface WalletConnectSession {
  topic: string;
  peer: {
    metadata: {
      name: string;
    };
  };
}