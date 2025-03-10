import * as algosdk from "algosdk";
import * as fs from "fs";
import * as path from "path";

async function deployERC1155(): Promise<number> {
  // Initialize Algod client
  const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
  
  // Get suggested params
  const suggestedParams = await algodClient.getTransactionParams().do();
  
  // Read approval and clear programs
  const approvalProgram = fs.readFileSync(
    path.join(__dirname, "../artifacts/erc1155_approval.teal"),
    "utf8"
  );
  const clearProgram = fs.readFileSync(
    path.join(__dirname, "../artifacts/erc1155_clear.teal"),
    "utf8"
  );
  
  // Compile programs
  const approvalResponse = await algodClient.compile(approvalProgram).do();
  const clearResponse = await algodClient.compile(clearProgram).do();
  
  const approvalBytes = new Uint8Array(Buffer.from(approvalResponse.result, "base64"));
  const clearBytes = new Uint8Array(Buffer.from(clearResponse.result, "base64"));
  
  // Create application
  const creator = algosdk.generateAccount();
  console.log("Creator address:", creator.addr);
  
  const txn = algosdk.makeApplicationCreateTxn(
    creator.addr,
    suggestedParams,
    algosdk.OnApplicationComplete.NoOpOC,
    approvalBytes,
    clearBytes,
    4, // Local ints (for balances and approvals)
    4, // Local bytes (for balance keys and approval keys)
    2, // Global ints (creator and total assets)
    1, // Global bytes (creator address)
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );
  
  // Sign and submit
  const signedTxn = txn.signTxn(creator.sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  
  // Wait for confirmation
  const result = await algosdk.waitForConfirmation(algodClient, txId, 4);
  const appId = result["application-index"];
  console.log("Created app with id:", appId);
  
  return appId;
}

// Run deployment
deployERC1155()
  .then(appId => {
    console.log("Deployment successful. App ID:", appId);
    process.exit(0);
  })
  .catch(error => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 