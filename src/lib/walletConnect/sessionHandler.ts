import { SignClientType, TransactionCallback, AlgorandTransaction } from './types';
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
          const from = algosdk.encodeAddress((decodedTxn as any).snd);
          const to = algosdk.encodeAddress((decodedTxn as any).rcv);
          
          const transaction: AlgorandTransaction = {
            type: 'pay',
            from: from,
            to: to,
            amount: (decodedTxn as any).amt || 0,
            fee: (decodedTxn as any).fee || 0,
            group: (decodedTxn as any).grp,
            signTxn: (key: Uint8Array) => {
              console.log("Creating transaction object for signing");
              const txn = algosdk.Transaction.from_obj_for_encoding(decodedTxn as algosdk.TransactionParams);
              console.log("Transaction object created:", txn);
              const signedTxn = txn.signTxn(key);
              console.log("Transaction signed successfully");
              return signedTxn;
            }
          };
          callback(transaction);
        }
      } catch (error) {
        console.error("Error processing transaction:", error);
        throw error;
      }
    }
  });
}