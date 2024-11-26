import type { SignClientTypes } from '@walletconnect/types';
import type { Transaction } from 'algosdk';

export type SessionProposalEvent = SignClientTypes.EventArguments['session_proposal'];

export interface WalletConnectTransaction extends Transaction {
  signTxn: (privateKey: Uint8Array) => Uint8Array;
}

export type TransactionCallback = (transaction: WalletConnectTransaction) => void;