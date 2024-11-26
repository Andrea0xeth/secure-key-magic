import { SignClient } from '@walletconnect/sign-client';
import * as algosdk from 'algosdk';

export type TransactionCallback = (transaction: algosdk.Transaction) => void;

export interface TransactionRequest {
  method: string;
  params: any[];
}

export interface SessionProposal {
  params: {
    request: TransactionRequest;
  };
}

export type SignClientType = InstanceType<typeof SignClient>;

export interface EncodedTransaction {
  txn: string;
  signer?: string;
  message?: string;
}

export interface DecodedTransaction {
  snd?: Uint8Array;
  rcv?: Uint8Array;
  amt?: number;
  fee?: number;
  fv?: number;
  lv?: number;
  note?: Uint8Array;
  gen?: string;
  gh?: string;
  type?: string;
  grp?: Uint8Array;
}

export interface TransactionParams {
  type?: string;
  fee: number;
  firstRound: number;
  lastRound: number;
  genesisID: string;
  genesisHash: string;
  note?: Uint8Array;
  group?: Uint8Array;
  from: string;
  to: string;
  amount: number;
}