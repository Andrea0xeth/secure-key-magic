import { SignClient } from '@walletconnect/sign-client';
import { Transaction, TransactionType } from 'algosdk';
import { SessionTypes } from '@walletconnect/types';

export type TransactionCallback = (transaction: Transaction) => void;

export interface AlgorandTransaction {
  type: TransactionType;
  from: { publicKey: Uint8Array };
  to: { publicKey: Uint8Array };
  amount: bigint;
  fee: number;
  firstRound: number;
  lastRound: number;
  note?: Uint8Array;
  genesisID: string;
  genesisHash: string;
  group?: Uint8Array;
  signTxn: (privateKey: Uint8Array) => Uint8Array;
}

export interface SignClientType extends SignClient {
  session: {
    values: SessionTypes.Struct[];
  };
  on: (event: string, callback: (event: any) => void) => void;
  off: (event: string, callback: (event: any) => void) => void;
  pair: (params: { uri: string }) => Promise<void>;
  approve: (params: any) => Promise<void>;
  disconnect: (params: { topic: string; reason: { code: number; message: string } }) => Promise<void>;
}