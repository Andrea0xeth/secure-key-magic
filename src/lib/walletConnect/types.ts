import { SignClient } from '@walletconnect/sign-client';
import * as algosdk from 'algosdk';

export type TransactionCallback = (transaction: algosdk.Transaction) => void;

export interface TransactionRequest {
  method: string;
  params: any[];
}

export interface DecodedAlgorandTransaction {
  type?: algosdk.TransactionType;
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

export interface AlgorandTransaction {
  type: algosdk.TransactionType;
  from: string;
  to: string;
  amount: number | bigint;
  fee: number;
  group?: Uint8Array;
  signTxn: (privateKey: Uint8Array) => Uint8Array;
}

export type SignClientType = InstanceType<typeof SignClient>;