import { SignClientType } from './types';
import * as algosdk from 'algosdk';
import { getSignClient } from './client';

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
  console.log("Setting transaction callback");
  transactionCallback = callback;
}

export async function handleTransactionRequest(txnParams: any) {
  console.log("Handling transaction request with parameters:", txnParams);
  
  if (!txnParams || !txnParams.txn) {
    console.error("Invalid transaction parameters:", txnParams);
    return;
  }

  try {
    // Decode the base64 transaction
    const txnBuffer = Buffer.from(txnParams.txn, 'base64');
    const decodedTxn = algosdk.decodeUnsignedTransaction(txnBuffer);
    
    console.log("Successfully decoded transaction:", decodedTxn);
    
    if (transactionCallback) {
      transactionCallback(decodedTxn);
    } else {
      console.error("No transaction callback set");
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    throw error;
  }
}

export async function respondToWalletConnect(signedTxn: Uint8Array) {
  try {
    const client = getSignClient();
    if (!client) {
      throw new Error("WalletConnect client not initialized");
    }

    const sessions = client.session.values;
    if (sessions.length === 0) {
      throw new Error("No active WalletConnect sessions");
    }

    // Get the latest session
    const session = sessions[sessions.length - 1];
    
    // Format the response as expected by WalletConnect
    const response = [Buffer.from(signedTxn).toString('base64')];
    
    console.log("Responding to WalletConnect with signed transaction");
    
    // Send the response back through WalletConnect
    await client.respond({
      topic: session.topic,
      response: {
        id: Date.now(),
        jsonrpc: '2.0',
        result: response
      }
    });

    console.log("Successfully sent signed transaction response to WalletConnect");
  } catch (error) {
    console.error("Error responding to WalletConnect:", error);
    throw error;
  }
}