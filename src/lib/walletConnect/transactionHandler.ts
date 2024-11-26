import { Transaction } from "algosdk";
import { TransactionParams } from "./transactionTypes";

let transactionCallback: ((transaction: Transaction) => void) | null = null;

export const setTransactionCallback = (callback: (transaction: Transaction) => void) => {
  transactionCallback = callback;
};

export const handleTransaction = async (params: TransactionParams) => {
  if (!transactionCallback) {
    throw new Error("No transaction callback set");
  }

  // Convert the transaction parameters to a Transaction object
  const transaction = new Transaction({
    type: params.type,
    amount: params.amount,
    to: params.to,
    fee: params.fee,
    firstRound: params.firstRound,
    lastRound: params.lastRound,
    genesisID: params.genesisID,
    genesisHash: Buffer.from(params.genesisHash, 'base64'),
    note: params.note ? Buffer.from(params.note, 'base64') : undefined,
  });

  transactionCallback(transaction);
};