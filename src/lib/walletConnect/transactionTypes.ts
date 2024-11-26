import * as algosdk from "algosdk";

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
  grp?: Uint8Array;
  // Asset Transfer specific
  xaid?: number;
  aamt?: number;
  asnd?: Uint8Array;
  arcv?: Uint8Array;
  // Asset Config specific
  caid?: number;
  apar?: {
    t: number;
    dc?: number;
    df?: boolean;
    un?: string;
    an?: string;
    au?: string;
    am?: string;
    m?: string;
    r?: string;
    f?: string;
    c?: string;
  };
  // Asset Freeze specific
  faid?: number;
  fadd?: Uint8Array;
  afrz?: boolean;
  // App Call specific
  apid?: number;
  apan?: number;
  apat?: Uint8Array[];
  apaa?: Uint8Array[];
  apfa?: number[];
  apas?: number[];
  apgs?: {
    nui?: number;
    nbs?: number;
  };
  apls?: {
    nui?: number;
    nbs?: number;
  };
}

export const getTransactionType = (txn: DecodedAlgorandTransaction): string => {
  if (txn.type) return txn.type;
  if (txn.xaid !== undefined) return "axfer"; // Asset Transfer
  if (txn.apar !== undefined) return "acfg";  // Asset Config
  if (txn.faid !== undefined) return "afrz";  // Asset Freeze
  if (txn.apid !== undefined) return "appl";  // Application Call
  if (txn.rcv !== undefined) return "pay";    // Payment
  return "unknown";
};