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