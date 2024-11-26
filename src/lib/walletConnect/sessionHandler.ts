import { SignClient } from '@walletconnect/sign-client';
import { TransactionCallback } from './types';
import * as algosdk from 'algosdk';

export function setupSessionHandlers(client: SignClient, callback: TransactionCallback) {
  client.on("session_request", async (event) => {
    console.log("Received session request:", event);
    
    const { params } = event;
    if (params.request?.method === "algo_signTxn") {
      console.log("Received sign transaction request");
      
      try {
        const txnParams = params.request.params[0][0];
        console.log("Transaction params:", txnParams);
        
        const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64'));
        console.log("Decoded transaction:", decodedTxn);
        
        if (callback) {
          const transaction = new algosdk.Transaction(decodedTxn as algosdk.TransactionParams);
          console.log("Calling transaction callback with transaction:", transaction);
          callback(transaction);
        }
      } catch (error) {
        console.error("Error processing transaction:", error);
        throw error;
      }
    }
  });
}