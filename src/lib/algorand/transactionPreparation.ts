import * as algosdk from "algosdk";
import { toast } from "@/components/ui/use-toast";

export const prepareNFTMintingTransaction = async (
  walletAddress: string,
  eventTitle: string,
  eventDate: string,
  imageUrl: string
): Promise<string> => {
  console.log("Preparing NFT minting transaction...");
  try {
    if (!walletAddress) {
      throw new Error("Wallet address is required");
    }

    const account = {
      addr: walletAddress,
      sk: new Uint8Array(32) // This will be replaced with the actual private key from passkey
    };

    // Create the NFT transaction
    const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
    const suggestedParams = await algodClient.getTransactionParams().do();

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: account.addr,
      total: 1,
      decimals: 0,
      assetName: `${eventTitle} Attendance`.slice(0, 32),
      unitName: "EVTNFT",
      assetURL: imageUrl,
      manager: account.addr,
      reserve: account.addr,
      freeze: account.addr,
      clawback: account.addr,
      defaultFrozen: true,
      suggestedParams,
    });

    // Convert transaction to base64
    const txnBytes = txn.toByte();
    const txnBase64 = Buffer.from(txnBytes).toString('base64');
    console.log("Transaction prepared successfully:", txnBase64);
    
    return txnBase64;
  } catch (error) {
    console.error("Error preparing NFT minting transaction:", error);
    throw error;
  }
};