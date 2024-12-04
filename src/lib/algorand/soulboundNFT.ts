import * as algosdk from "algosdk";

export async function createSoulboundNFT(
  creator: { addr: string; sk: Uint8Array },
  eventTitle: string,
  eventDate: string,
  imageUrl: string
) {
  console.log("Creating soulbound NFT for event:", eventTitle);
  
  // Configure suggested parameters
  const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
  const suggestedParams = await algodClient.getTransactionParams().do();
  console.log("Got suggested params:", suggestedParams);

  // Truncate the asset name to stay within the 32-character limit
  const truncatedAssetName = eventTitle.slice(0, 32);
  console.log("Using truncated asset name:", truncatedAssetName);

  // Create the asset creation transaction
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creator.addr,
    total: 1,
    decimals: 0,
    assetName: truncatedAssetName,
    unitName: "EVTNFT",
    assetURL: imageUrl,
    manager: creator.addr,
    reserve: creator.addr,
    freeze: creator.addr,
    clawback: creator.addr,
    defaultFrozen: true, // This makes it soulbound - tokens can't be transferred
    suggestedParams,
  });

  console.log("Created asset creation transaction:", txn);

  // Sign the transaction with the creator's private key
  console.log("Signing transaction with private key...");
  const signedTxn = txn.signTxn(creator.sk);
  console.log("Transaction signed successfully");

  // Submit the transaction to the network
  console.log("Submitting transaction to network...");
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  console.log("Transaction submitted with ID:", txId);

  // Wait for confirmation
  console.log("Waiting for transaction confirmation...");
  const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
  console.log("Transaction confirmed in round:", result["confirmed-round"]);

  // Get the asset ID
  const assetId = result["asset-index"];
  console.log("Created asset with ID:", assetId);
  
  return assetId;
}