import { toast } from "@/hooks/use-toast";
import type { SessionProposalEvent } from "./types";
import SignClient from '@walletconnect/sign-client';

export const handleSessionProposal = async (
  client: SignClient,
  proposal: SessionProposalEvent,
  address: string
) => {
  console.log("Handling session proposal:", proposal);
  
  try {
    const { id, params } = proposal;
    
    const approvalData = {
      id,
      namespaces: {
        algorand: {
          accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${address}`],
          methods: ['algo_signTxn'],
          events: ['accountsChanged']
        }
      }
    };

    console.log("Approving session with data:", approvalData);
    await client.approve(approvalData);
    
    toast({
      title: "Connected",
      description: "Successfully connected to dApp",
    });
    
    return true;
  } catch (error) {
    console.error("Error handling session proposal:", error);
    toast({
      title: "Connection Failed",
      description: "Failed to establish connection with dApp",
      variant: "destructive",
    });
    return false;
  }
};