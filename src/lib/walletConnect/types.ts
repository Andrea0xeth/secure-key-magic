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

export interface AlgorandTransaction extends algosdk.Transaction {
  signTxn: (privateKey: Uint8Array) => Uint8Array;
}