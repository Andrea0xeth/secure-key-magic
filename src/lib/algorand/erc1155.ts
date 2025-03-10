import * as algosdk from "algosdk";
import { Buffer } from "buffer";

export class ERC1155Client {
  private algodClient: algosdk.Algodv2;
  private appId: number;
  private creator: algosdk.Account;

  constructor(
    algodClient: algosdk.Algodv2,
    appId: number,
    creator: algosdk.Account
  ) {
    this.algodClient = algodClient;
    this.appId = appId;
    this.creator = creator;
  }

  async createToken(): Promise<number> {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeApplicationCallTxnFromObject({
      from: this.creator.addr,
      appIndex: this.appId,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [new Uint8Array(Buffer.from("create_token"))],
      suggestedParams,
    });

    const signedTxn = txn.signTxn(this.creator.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(this.algodClient, txId, 4);

    const totalAssets = await this.getTotalAssets();
    return totalAssets;
  }

  async mint(to: string, tokenId: number, amount: number): Promise<void> {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeApplicationCallTxnFromObject({
      from: this.creator.addr,
      appIndex: this.appId,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [
        new Uint8Array(Buffer.from("mint")),
        new Uint8Array(Buffer.from(to)),
        algosdk.encodeUint64(tokenId),
        algosdk.encodeUint64(amount),
      ],
      accounts: [to],
      suggestedParams,
    });

    const signedTxn = txn.signTxn(this.creator.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(this.algodClient, txId, 4);
  }

  async transfer(
    from: string,
    to: string,
    tokenId: number,
    amount: number,
    senderAccount: algosdk.Account
  ): Promise<void> {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeApplicationCallTxnFromObject({
      from: senderAccount.addr,
      appIndex: this.appId,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [
        new Uint8Array(Buffer.from("transfer")),
        new Uint8Array(Buffer.from(from)),
        new Uint8Array(Buffer.from(to)),
        algosdk.encodeUint64(tokenId),
        algosdk.encodeUint64(amount),
      ],
      accounts: [from, to],
      suggestedParams,
    });

    const signedTxn = txn.signTxn(senderAccount.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(this.algodClient, txId, 4);
  }

  async setApprovalForAll(
    operator: string,
    approved: boolean,
    ownerAccount: algosdk.Account
  ): Promise<void> {
    const suggestedParams = await this.algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeApplicationCallTxnFromObject({
      from: ownerAccount.addr,
      appIndex: this.appId,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      appArgs: [
        new Uint8Array(Buffer.from("set_approval")),
        new Uint8Array(Buffer.from(operator)),
        new Uint8Array([approved ? 1 : 0]),
      ],
      accounts: [operator],
      suggestedParams,
    });

    const signedTxn = txn.signTxn(ownerAccount.sk);
    const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(this.algodClient, txId, 4);
  }

  async balanceOf(account: string, tokenId: number): Promise<number> {
    const accountInfo = await this.algodClient
      .accountApplicationInformation(account, this.appId)
      .do();
    
    const localState = accountInfo["app-local-state"];
    if (!localState) return 0;

    const balanceKey = Buffer.concat([
      Buffer.from("balance"),
      Buffer.from(account),
      algosdk.encodeUint64(tokenId),
    ]).toString("base64");

    const keyValue = localState["key-value"];
    if (!keyValue) return 0;

    const balance = keyValue.find((kv: any) => kv.key === balanceKey);
    return balance ? balance.value.uint : 0;
  }

  private async getTotalAssets(): Promise<number> {
    const appInfo = await this.algodClient.getApplicationByID(this.appId).do();
    const globalState = appInfo.params["global-state"];
    
    const totalAssetsKey = Buffer.from("total_assets").toString("base64");
    const totalAssets = globalState.find((kv: any) => kv.key === totalAssetsKey);
    
    return totalAssets ? totalAssets.value.uint : 0;
  }
} 