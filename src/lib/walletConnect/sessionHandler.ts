import { toast } from "@/hooks/use-toast";
import SignClient from '@walletconnect/sign-client';
import type { SessionProposalEvent } from "./types";

export const handleSessionProposal = async (
  client: SignClient,
  proposal: SessionProposalEvent,
  address: string
) => {
  console.log("Handling session proposal:", proposal);
  
  try {
    const { id, params } = proposal;
    
    // Validate proposal structure and required namespaces
    if (!params?.requiredNamespaces?.algorand) {
      console.error("Invalid proposal structure or missing algorand namespace:", params);
      throw new Error("Invalid session proposal format");
    }

    const { methods = [], chains = [], events = [] } = params.requiredNamespaces.algorand;

    const namespaces = {
      algorand: {
        accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${address}`],
        methods: methods.length ? methods : ['algo_signTxn'],
        events: events.length ? events : ['accountsChanged'],
        chains: chains.length ? chains : ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k']
      }
    };

    console.log("Approving session with namespaces:", namespaces);
    await client.approve({
      id,
      namespaces
    });
    
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