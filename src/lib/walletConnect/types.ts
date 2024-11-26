import { SignClient } from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import * as algosdk from 'algosdk';

export type TransactionCallback = (transaction: algosdk.Transaction) => void;

export interface TransactionRequest {
  method: string;
  params: any[];
}

export interface SessionProposal {
  id: number;
  params: SessionTypes.Proposal;
}

export interface AlgorandTransaction {
  type: algosdk.TransactionType;
  from: string;
  to: string;
  amount: number | bigint;
  fee: number;
  group?: Uint8Array;
  signTxn: (privateKey: Uint8Array) => Uint8Array;
}

export interface DecodedAlgorandTransaction {
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

export interface SessionRequestEvent {
  id: number;
  params: {
    request: {
      method: string;
      params: any[];
    };
  };
}

export type SignClientType = InstanceType<typeof SignClient> & {
  session: {
    values: SessionTypes.Struct[];
  };
};