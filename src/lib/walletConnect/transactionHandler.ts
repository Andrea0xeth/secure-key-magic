import { SignClientType } from './types';
import * as algosdk from 'algosdk';
import { getSignClient } from './client';

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;
let currentRequest: { topic: string; id: number } | null = null;

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
  console.log("Setting transaction callback");
  transactionCallback = callback;
}

export async function handleTransactionRequest(txnParams: any, requestEvent?: any) {
  console.log("Handling transaction request with parameters:", txnParams);
  console.log("Request event:", requestEvent);
  
  if (!txnParams || !txnParams.txn) {
    console.error("Invalid transaction parameters:", txnParams);
    return;
  }

  // Store the request details for later response
  if (requestEvent) {
    currentRequest = {
      topic: requestEvent.topic,
      id: requestEvent.id
    };
    console.log("Stored current request details:", currentRequest);
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

    if (!currentRequest) {
      throw new Error("No active request to respond to");
    }

    console.log("Responding to WalletConnect with request:", currentRequest);
    
    // Format the response as expected by WalletConnect
    const response = [Buffer.from(signedTxn).toString('base64')];
    
    // Send the response back through WalletConnect
    await client.respond({
      topic: currentRequest.topic,
      response: {
        id: currentRequest.id,
        jsonrpc: '2.0',
        result: response
      }
    });

    console.log("Successfully sent signed transaction response");
    
    // Clear the current request after successful response
    currentRequest = null;
  } catch (error) {
    console.error("Error responding to WalletConnect:", error);
    throw error;
  }
}