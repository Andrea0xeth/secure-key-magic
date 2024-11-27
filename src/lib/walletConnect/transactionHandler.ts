import { SignClientType } from './types';
import * as algosdk from 'algosdk';
import { getSignClient } from './client';

let currentRequest: {
  topic: string;
  id: number;
  params: any[];
} | null = null;

let transactionCallback: ((transaction: algosdk.Transaction) => void) | null = null;

export function setTransactionCallback(callback: (transaction: algosdk.Transaction) => void) {
  console.log("Setting transaction callback");
  transactionCallback = callback;
}

export async function handleTransactionRequest(params: any) {
  console.log("Received transaction request with parameters:", params);
  
  if (!transactionCallback) {
    console.error("No transaction callback set");
    return;
  }

  try {
    const txnParams = params[0];
    console.log("Transaction params:", txnParams);
    
    const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64'));
    console.log("Decoded transaction:", decodedTxn);
    
    if (!decodedTxn) {
      throw new Error("Failed to decode transaction");
    }

    const senderAddr = (decodedTxn as any).snd ? 
      algosdk.encodeAddress((decodedTxn as any).snd) : 
      null;

    if (!senderAddr) {
      throw new Error("Sender address must not be null or undefined");
    }

    const receiverAddr = (decodedTxn as any).rcv ? 
      algosdk.encodeAddress((decodedTxn as any).rcv) : 
      senderAddr;

    const suggestedParams = {
      fee: (decodedTxn as any).fee || 1000,
      firstRound: (decodedTxn as any).fv || 0,
      lastRound: (decodedTxn as any).lv || 0,
      genesisID: (decodedTxn as any).gen || '',
      genesisHash: (decodedTxn as any).gh || '',
      flatFee: true
    };

    const txn = new algosdk.Transaction({
      from: senderAddr,
      to: receiverAddr,
      amount: (decodedTxn as any).amt || 0,
      ...suggestedParams
    });
    
    console.log("Created Algorand transaction object:", txn);
    transactionCallback(txn);
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
    
    console.log("Responding to WalletConnect with signed transaction:", response);
    
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