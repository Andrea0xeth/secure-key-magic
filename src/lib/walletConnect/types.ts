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

export interface AlgorandTransaction {
  type: string;
  from: string;
  to: string;
  amount: number | bigint;
  fee: number | bigint;
  group?: Uint8Array;
  signTxn: (key: Uint8Array) => Uint8Array;
}

export interface EncodedTransaction {
  txn: string;
  signer?: string;
  message?: string;
}