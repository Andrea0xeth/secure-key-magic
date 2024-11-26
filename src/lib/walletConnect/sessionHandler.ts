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
          const txn = new algosdk.Transaction({
            from: algosdk.encodeAddress((decodedTxn as any).snd),
            to: algosdk.encodeAddress((decodedTxn as any).rcv),
            amount: (decodedTxn as any).amt || 0,
            fee: (decodedTxn as any).fee || 0,
            firstRound: (decodedTxn as any).fv,
            lastRound: (decodedTxn as any).lv,
            genesisHash: (decodedTxn as any).gh,
            genesisID: (decodedTxn as any).gen,
            type: (decodedTxn as any).type,
            note: (decodedTxn as any).note,
            group: (decodedTxn as any).grp,
          });
          
          console.log("Created Algorand transaction object:", txn);
          callback(txn);
        }
      } catch (error) {
        console.error("Error processing transaction:", error);
        throw error;
      }
    }
  });
}