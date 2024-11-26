import { SignClient } from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { Transaction, TransactionType } from 'algosdk';

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

export interface SessionProposal {
  id: number;
  params: {
    id: number;
    params: {
      request: {
        method: string;
        params: any[];
      };
    };
  };
}

export type SignClientType = SignClient & {
  session: {
    values: SessionTypes.Struct[];
  };
};

export interface DecodedAlgorandTransaction {
  type: TransactionType;
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