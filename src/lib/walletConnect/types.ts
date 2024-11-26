import { SignClient } from '@walletconnect/sign-client';
import * as algosdk from 'algosdk';

export type TransactionCallback = (transaction: algosdk.Transaction) => void;

export interface TransactionRequest {
  method: string;
  params: any[];
}

export interface DecodedAlgorandTransaction {
  type?: 'pay' | 'axfer' | 'acfg' | 'afrz' | 'appl' | string;
  snd?: Uint8Array;
  rcv?: Uint8Array;
  amt?: number;
  fee?: number;
  fv?: number;
  lv?: number;
  note?: Uint8Array;
  gen?: string;
  gh?: string;
  xaid?: number; // Asset ID for asset transfer
  afrz?: boolean; // Asset freeze state
  faid?: number; // Frozen asset ID
  apid?: number; // Application ID
  apan?: number; // Application on complete
  apaa?: Uint8Array[]; // Application arguments
  apat?: string[]; // Application accounts
  apfa?: number[]; // Foreign applications
  apas?: number[]; // Foreign assets
  t?: number; // Asset total supply
  dc?: number; // Asset decimals
  un?: string; // Asset unit name
  an?: string; // Asset name
}

export type SignClientType = InstanceType<typeof SignClient>;