import * as algosdk from "algosdk";

export async function createSoulboundNFT(
  creator: algosdk.Account,
  eventTitle: string,
  eventDate: string,
  imageUrl: string
) {
  console.log("Creating soulbound NFT for event:", eventTitle);
  
  // Configure suggested parameters
  const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
  const suggestedParams = await algodClient.getTransactionParams().do();

  // Truncate the asset name to stay within the 32-character limit
  const truncatedAssetName = `${eventTitle} Attendance`.slice(0, 32);
  console.log("Using truncated asset name:", truncatedAssetName);

  // Asset creation transaction
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

  // Sign the transaction
  const signedTxn = txn.signTxn(creator.sk);
  console.log("Transaction signed successfully");

  // Submit the transaction
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  console.log("Transaction submitted with ID:", txId);

  // Wait for confirmation
  const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
  console.log("Transaction confirmed in round:", result["confirmed-round"]);

  // Get the asset ID
  const assetId = result["asset-index"];
  console.log("Created asset with ID:", assetId);
  
  return assetId;
}

export async function optInToSoulboundNFT(
  receiver: algosdk.Account,
  assetId: number
) {
  console.log("Opting in to soulbound NFT:", assetId);
  
  const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
  const suggestedParams = await algodClient.getTransactionParams().do();

  // Asset opt-in transaction
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: receiver.addr,
    to: receiver.addr,
    assetIndex: assetId,
    amount: 0,
    suggestedParams,
  });

  // Sign and submit transaction
  const signedTxn = txn.signTxn(receiver.sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  
  // Wait for confirmation
  await algosdk.waitForConfirmation(algodClient, txId, 4);
  console.log("Successfully opted in to asset:", assetId);
}

export async function transferSoulboundNFT(
  creator: algosdk.Account,
  receiver: string,
  assetId: number
) {
  console.log("Transferring soulbound NFT to:", receiver);
  
  const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
  const suggestedParams = await algodClient.getTransactionParams().do();

  // Asset transfer transaction
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: creator.addr,
    to: receiver,
    assetIndex: assetId,
    amount: 1,
    suggestedParams,
  });

  // Sign and submit transaction
  const signedTxn = txn.signTxn(creator.sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  
  // Wait for confirmation
  await algosdk.waitForConfirmation(algodClient, txId, 4);
  console.log("Successfully transferred NFT to:", receiver);
}