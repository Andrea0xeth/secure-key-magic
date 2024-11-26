import { SignClientType, TransactionCallback } from './types';
import * as algosdk from 'algosdk';

export function setupSessionHandlers(client: SignClientType, callback: TransactionCallback) {
  client.on("session_request", async (event) => {
    console.log("Received session request:", event);
    
    if (event.params?.request?.method === "algo_signTxn") {
      console.log("Received sign transaction request");
      
      try {
        const txnParams = event.params.request.params[0][0];
        console.log("Transaction params:", txnParams);
        
        const decodedTxn = algosdk.decodeObj(Buffer.from(txnParams.txn, 'base64'));
        console.log("Decoded transaction:", decodedTxn);
        
        if (callback && decodedTxn) {
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