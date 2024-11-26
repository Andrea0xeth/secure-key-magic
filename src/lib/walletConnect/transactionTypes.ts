import * as algosdk from "algosdk";

export interface TransactionParams {
  type: string;
  to: string;
  fee: number;
  firstRound: number;
  lastRound: number;
  genesisID: string;
  genesisHash: string;
  note?: string;
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

export interface TransactionRequest {
  method: string;
  params: any[];
}

export interface SessionProposal {
  params: {
    request: TransactionRequest;
  };
}